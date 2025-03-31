#!/usr/bin/env python
# -*- coding: utf-8 -*-

import os
import sys
import time
from pathlib import Path
from typing import Dict, List
import argparse
from tqdm import tqdm
from concurrent.futures import ThreadPoolExecutor, as_completed
from file_scanner import FileScanner
from component_analyzer import ComponentAnalyzer
from optimized_report_generator import ReportGenerator

class ReactScanner:
    """React组件扫描器
    
    这个类负责扫描React项目目录，分析组件的定义和引用关系，并生成分析报告。
    它协调了文件扫描、组件分析和报告生成三个主要功能模块的工作。
    """
    
    def __init__(self, path: str, parallel: bool = True, workers: int = 4, max_files: int = 5000):
        """初始化React扫描器
        
        Args:
            path (str): 要扫描的React项目根目录路径
            parallel (bool): 是否启用并行处理
            workers (int): 并行工作线程数，默认为None（由系统决定）
            max_files (int): 最大处理文件数量限制
        
        初始化过程会创建：
        - root_path: 项目根目录的Path对象
        - file_scanner: 用于扫描React文件的扫描器
        - component_analyzer: 用于分析组件定义和引用的分析器
        """
        self.root_path = Path(path)
        self.file_scanner = FileScanner(path, parallel=parallel, workers=workers, max_files=max_files)
        self.component_analyzer = ComponentAnalyzer()
        self.parallel = parallel
        self.workers = workers
        self.scan_start_time = 0
        self.scan_end_time = 0
    
    def scan_react_components(self, output_markdown_path: str | None = None):
        """执行React组件的扫描分析
        
        这个方法执行完整的扫描分析流程：
        1. 扫描项目目录下的所有React相关文件(.jsx, .tsx, .js, .ts)
        2. 分析每个文件中的组件定义和引用
        3. 生成最终的分析报告
        
        工作流程：
        - 首先调用file_scanner扫描所有React文件
        - 然后对每个文件的内容进行组件分析
        - 最后使用分析结果生成报告
        
        Args:
            output_markdown_path (str): 可选，输出Markdown报告的文件路径
        """
        self.scan_start_time = time.time()
        print(f"Starting React component scan in {self.root_path}")
        
        # 扫描所有React文件
        react_files = self.file_scanner.scan_directory()
        
        if not react_files:
            print("No React files found. Scan completed.")
            return
            
        print(f"\nAnalyzing {len(react_files)} React files for components...")
        
        # 分析每个文件中的组件
        if self.parallel and len(react_files) > 10:  # 只有文件数量足够多时才使用并行
            # 并行读取文件内容
            print("Reading files in parallel...")
            file_contents = FileScanner.read_files_parallel(react_files, self.workers)
            
            # 并行分析文件内容
            print("Analyzing files in parallel...")
            with ThreadPoolExecutor(max_workers=self.workers) as executor:
                futures = []
                with tqdm(total=len(file_contents), desc="Analyzing components", unit="file") as pbar:
                    for file_path, content in file_contents.items():
                        futures.append(
                            executor.submit(self._analyze_file_wrapper, file_path, content)
                        )
                    
                    for future in as_completed(futures):
                        future.result()  # 获取结果，但我们不需要返回值
                        pbar.update(1)
        else:
            # 串行处理
            with tqdm(total=len(react_files), desc="Analyzing components", unit="file") as pbar:
                for file_path in react_files:
                    content = FileScanner.read_file_content(file_path)
                    if content:  # 只有成功读取文件内容才进行分析
                        self.component_analyzer.analyze_file(file_path, self.root_path, content)
                    pbar.update(1)
        
        # 生成分析报告
        analysis_results = self.component_analyzer.get_analysis_results()
        report_generator = ReportGenerator(
            analysis_results['component_definitions'],  # 组件定义信息
            analysis_results['component_references'],   # 组件引用信息
            analysis_results['imports']                # 导入语句信息
        )
        
        # 生成控制台报告
        report_generator.generate_report()
        
        # 如果指定了输出Markdown文件，则生成Markdown报告
        if output_markdown_path:
            report_generator.generate_markdown_report(output_markdown_path)
        
        self.scan_end_time = time.time()
        scan_duration = self.scan_end_time - self.scan_start_time
        print(f"\nTotal scan and analysis completed in {scan_duration:.2f} seconds.")
        print(f"Found {len(analysis_results['component_definitions'])} components with {sum(len(refs) for refs in analysis_results['component_references'].values())} references.")
    
    def _analyze_file_wrapper(self, file_path, content):
        """文件分析的包装函数，用于并行处理
        
        Args:
            file_path (Path): 文件路径
            content (str): 文件内容
            
        Returns:
            bool: 分析是否成功
        """
        try:
            self.component_analyzer.analyze_file(file_path, self.root_path, content)
            return True
        except Exception as e:
            print(f"Error analyzing {file_path}: {str(e)}")
            return False

if __name__ == '__main__':
    # 使用argparse解析命令行参数
    parser = argparse.ArgumentParser(description='React组件扫描工具')
    parser.add_argument('directory', help='要扫描的React项目目录路径')
    parser.add_argument('--markdown', '-m', help='生成Markdown报告的输出路径', default=None)
    parser.add_argument('--parallel', '-p', action='store_true', help='启用并行处理')
    parser.add_argument('--workers', '-w', type=int, help='并行工作线程数', default=None)
    parser.add_argument('--max-files', type=int, help='最大处理文件数量限制', default=5000)
    
    args = parser.parse_args()
    
    # 创建扫描器并执行扫描
    scanner = ReactScanner(
        args.directory,
        parallel=args.parallel,
        workers=args.workers,
        max_files=args.max_files
    )
    
    # 执行扫描并生成报告
    scanner.scan_react_components(output_markdown_path=args.markdown)