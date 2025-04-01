#!/usr/bin/env python
# -*- coding: utf-8 -*-

import json
import os
import time
from pathlib import Path
from typing import Dict, Optional
import hashlib

class ComponentIndexManager:
    """组件索引管理器
    
    负责管理React组件定义的本地索引，包括：
    - 将组件定义信息序列化到本地文件
    - 从本地文件加载组件定义信息
    - 维护索引的版本控制
    """
    
    def __init__(self, root_path: str):
        """初始化组件索引管理器
        
        Args:
            root_path (str): React项目的根目录路径
        """
        self.root_path = Path(root_path)
        self.index_dir = self.root_path / '.react-index'
        self.index_file = self.index_dir / 'component-index.json'
        self.version_file = self.index_dir / 'version.json'
        self._ensure_index_dir()
    
    def _ensure_index_dir(self):
        """确保索引目录存在"""
        os.makedirs(self.index_dir, exist_ok=True)
    
    def _calculate_project_hash(self, react_files: list) -> str:
        """计算项目文件的哈希值，用于版本控制
        
        Args:
            react_files (list): React文件路径列表
            
        Returns:
            str: 项目文件的哈希值
        """
        hasher = hashlib.md5()
        for file_path in sorted(react_files):  # 排序以确保一致性
            try:
                mtime = os.path.getmtime(file_path)
                file_info = f"{file_path}:{mtime}"
                hasher.update(file_info.encode())
            except OSError:
                continue
        return hasher.hexdigest()
    
    def save_index(self, component_definitions: Dict[str, str], react_files: list) -> None:
        """保存组件定义索引到本地文件
        
        Args:
            component_definitions (Dict[str, str]): 组件定义信息
            react_files (list): React文件路径列表
        """
        # 保存组件定义索引
        index_data = {
            'component_definitions': component_definitions,
            'timestamp': time.time()
        }
        with open(self.index_file, 'w', encoding='utf-8') as f:
            json.dump(index_data, f, indent=2)
        
        # 保存版本信息
        version_data = {
            'project_hash': self._calculate_project_hash(react_files),
            'timestamp': time.time()
        }
        with open(self.version_file, 'w', encoding='utf-8') as f:
            json.dump(version_data, f, indent=2)
    
    def load_index(self, react_files: list) -> Optional[Dict[str, str]]:
        """从本地文件加载组件定义索引
        
        如果索引文件不存在，或者项目文件有更新，返回None
        
        Args:
            react_files (list): React文件路径列表
            
        Returns:
            Optional[Dict[str, str]]: 组件定义信息，如果索引无效则返回None
        """
        try:
            # 检查版本信息
            if not (self.version_file.exists() and self.index_file.exists()):
                return None
                
            with open(self.version_file, 'r', encoding='utf-8') as f:
                version_data = json.load(f)
                
            current_hash = self._calculate_project_hash(react_files)
            if current_hash != version_data['project_hash']:
                return None  # 项目文件已更新，需要重新扫描
            
            # 加载组件定义索引
            with open(self.index_file, 'r', encoding='utf-8') as f:
                index_data = json.load(f)
                return index_data['component_definitions']
                
        except (json.JSONDecodeError, KeyError, OSError) as e:
            print(f"Error loading index: {str(e)}")
            return None