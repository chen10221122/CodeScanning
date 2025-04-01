#!/usr/bin/env python
# -*- coding: utf-8 -*-

from pathlib import Path
from typing import List, Dict, Generator, Tuple
from tqdm import tqdm
import threading
from contextlib import contextmanager
import time
from functools import wraps
import psutil
import os
import multiprocessing
from concurrent.futures import ThreadPoolExecutor, ProcessPoolExecutor, as_completed

class FileScanner:
    """文件扫描器
    
    这个类负责扫描指定目录下的React相关文件（.jsx, .tsx, .js, .ts）。
    它提供了递归扫描目录和读取文件内容的功能。
    """
    
    def __init__(self, root_path: str, max_files: int = 5000, batch_size: int = 1000, parallel: bool = True, workers: int | None = None):
        """初始化文件扫描器
        
        Args:
            root_path (str): 要扫描的项目根目录路径
            max_files (int): 最大处理文件数量限制
            batch_size (int): 每批处理的文件数量
            parallel (bool): 是否启用并行处理
            workers (int): 并行工作线程数，默认为CPU核心数
        """
        self.root_path = Path(root_path)
        self.max_files = max_files
        self.batch_size = batch_size
        self.parallel = parallel
        self.workers = workers or max(1, multiprocessing.cpu_count() - 1)
        self.scan_start_time = 0
        self.scan_end_time = 0

    def _get_memory_usage(self) -> str:
        """获取当前进程的内存使用情况"""
        process = psutil.Process(os.getpid())
        memory_info = process.memory_info()
        return f"{memory_info.rss / 1024 / 1024:.1f}MB"

    def _find_files(self) -> Generator[Path, None, None]:
        """生成器函数，用于逐个生成文件路径"""
        for item in self.root_path.rglob('*'):
            if item.is_file() and item.suffix in ('.jsx', '.tsx', '.js', '.ts'):
                yield item

    def scan_directory(self) -> List[Path]:
        """递归扫描目录下的React文件
        
        使用批处理方式遍历目录，查找所有React相关文件。
        支持的文件类型包括：.jsx, .tsx, .js, .ts
        文件数量受max_files参数限制，超过限制时会提前返回。
        支持并行处理以提高扫描速度。
        
        Returns:
            List[Path]: 找到的React文件路径列表
        """
        if not self.root_path.exists():
            print(f"Error: Path {self.root_path} does not exist")
            return []

        self.scan_start_time = time.time()
        react_files = []
        try:
            # 先收集所有文件路径
            all_files = list(self._find_files())
            total_files = len(all_files)
            
            if total_files == 0:
                print("No React files found in the directory.")
                return []
                
            # 限制最大文件数
            if total_files > self.max_files:
                print(f"Found {total_files} files, limiting to {self.max_files}")
                all_files = all_files[:self.max_files]
                
            with tqdm(desc="Scanning files", total=len(all_files), unit="file", ascii=True, ncols=100) as pbar:
                if self.parallel and len(all_files) > 10:  # 只有文件数量足够多时才使用并行
                    # 将文件分成批次
                    batches = [all_files[i:i + self.batch_size] for i in range(0, len(all_files), self.batch_size)]
                    
                    # 使用线程池并行处理批次
                    with ThreadPoolExecutor(max_workers=self.workers) as executor:
                        futures = []
                        for batch in batches:
                            futures.append(executor.submit(self._process_batch, batch))
                            
                        for future in as_completed(futures):
                            batch_result = future.result()
                            react_files.extend(batch_result)
                            pbar.update(len(batch_result))
                            pbar.set_postfix_str(
                                f"Found: {len(react_files)}/{len(all_files)} React files | Memory: {self._get_memory_usage()}"
                            )
                else:
                    # 串行处理
                    for file_path in all_files:
                        react_files.append(file_path)
                        pbar.update(1)
                        if len(react_files) % 100 == 0:
                            pbar.set_postfix_str(
                                f"Found: {len(react_files)}/{len(all_files)} React files | Memory: {self._get_memory_usage()}"
                            )

        except PermissionError as e:
            print(f"Access denied: {e.filename}")
        except Exception as e:
            print(f"Error scanning directory: {str(e)}")
        
        self.scan_end_time = time.time()
        scan_duration = self.scan_end_time - self.scan_start_time
        print(f"\nScan completed in {scan_duration:.2f} seconds. Found {len(react_files)} React files.")
        print(f"Scanning performance: {len(react_files) / scan_duration:.2f} files/second")

        return react_files
        
    def _process_batch(self, batch: List[Path]) -> List[Path]:
        """处理一批文件
        
        Args:
            batch (List[Path]): 要处理的文件路径列表
            
        Returns:
            List[Path]: 处理后的文件路径列表
        """
        return batch

    class TimeoutException(Exception):
        pass

    @staticmethod
    def timeout(seconds):
        """超时处理装饰器
        
        使用threading.Timer和Event对象实现超时功能，适用于Windows系统
        """
        def decorator(func):
            @wraps(func)
            def wrapper(*args, **kwargs):
                result = []
                exception = []
                event = threading.Event()
                
                def target():
                    try:
                        result.append(func(*args, **kwargs))
                        event.set()
                    except Exception as e:
                        exception.append(e)
                        event.set()
                
                thread = threading.Thread(target=target)
                thread.daemon = True
                thread.start()
                
                if not event.wait(timeout=seconds):
                    raise FileScanner.TimeoutException("Reading file timed out")
                
                if exception:
                    raise exception[0]
                return result[0]
            return wrapper
        return decorator

    @staticmethod
    def read_files_parallel(file_paths: List[Path], workers: int | None = None) -> Dict[Path, str]:
        """并行读取多个文件的内容
        
        使用线程池并行读取多个文件的内容，支持超时处理和错误处理。
        
        Args:
            file_paths (List[Path]): 要读取的文件路径列表
            workers (int): 并行工作线程数，默认为None（由系统决定）
            
        Returns:
            Dict[Path, str]: 文件路径和内容的字典
        """
        workers = workers or max(1, multiprocessing.cpu_count() - 1)
        file_contents = {}
        
        with ThreadPoolExecutor(max_workers=workers) as executor:
            futures = {}
            for file_path in file_paths:
                futures[executor.submit(FileScanner.read_file_content, file_path)] = file_path
            
            for future in as_completed(futures):
                file_path = futures[future]
                try:
                    content = future.result()
                    if content:  # 只保存成功读取的文件内容
                        file_contents[file_path] = content
                except Exception as e:
                    print(f"Error reading {file_path}: {str(e)}")
        
        return file_contents

    @staticmethod
    @timeout(30)
    def read_file_content(file_path: Path, chunk_size: int = 8192) -> str:
        """读取文件内容，支持不同编码和超时处理
        
        使用分块读取方式提高大文件处理性能，支持多种编码格式。
        
        Args:
            file_path (Path): 要读取的文件路径
            chunk_size (int): 每次读取的块大小，默认8KB
        
        Returns:
            str: 文件内容字符串。如果读取失败则返回空字符串
        """
        try:
            # 对于小文件，直接一次性读取更高效
            if file_path.stat().st_size < 1024 * 1024:  # 小于1MB的文件
                try:
                    return file_path.read_text(encoding='utf-8')
                except UnicodeDecodeError:
                    try:
                        return file_path.read_text(encoding=None)
                    except Exception:
                        pass
            
            # 对于大文件，使用分块读取
            with open(file_path, 'r', encoding='utf-8') as f:
                chunks = []
                while True:
                    chunk = f.read(chunk_size)
                    if not chunk:
                        break
                    chunks.append(chunk)
                return ''.join(chunks)
        except UnicodeDecodeError:
            try:
                with open(file_path, 'r', encoding=None) as f:
                    chunks = []
                    while True:
                        chunk = f.read(chunk_size)
                        if not chunk:
                            break
                        chunks.append(chunk)
                    return ''.join(chunks)
            except Exception as e:
                print(f"Error reading {file_path} with system encoding: {str(e)}")
                return ""
        except FileScanner.TimeoutException:
            print(f"Timeout: Reading {file_path} took more than 30 seconds")
            return ""
        except Exception as e:
            print(f"Error reading {file_path}: {str(e)}")
            return ""