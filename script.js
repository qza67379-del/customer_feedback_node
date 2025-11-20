/**
 * 顾客消息识别节点配置面板交互脚本
 * 整合了意图识别和关键词识别的交互功能
 */

// 等待 DOM 加载完成
document.addEventListener('DOMContentLoaded', function() {
    
    // ==================== 关闭按钮功能 ====================
    const closeButton = document.querySelector('.absolute.right-\\[32px\\].top-\\[24px\\]');
    const dialog = document.querySelector('[role="dialog"]');
    
    if (closeButton && dialog) {
        closeButton.addEventListener('click', function() {
            // 添加关闭动画
            dialog.style.transition = 'transform 0.3s ease-out, opacity 0.3s ease-out';
            dialog.style.transform = 'translateX(100%)';
            dialog.style.opacity = '0';
            
            // 动画结束后隐藏
            setTimeout(() => {
                dialog.style.display = 'none';
            }, 300);
        });
    }

    // ==================== 开关按钮切换功能 ====================
    const switches = document.querySelectorAll('[role="switch"]');
    const behaviorConfigContainer = document.getElementById('behaviorConfigContainer');
    
    // 存储手风琴body元素，用于后续更新高度
    const accordionBodiesMap = new Map();
    
    // 更新手风琴高度的函数（提前声明）
    function updateAccordionHeight(title) {
        const body = accordionBodiesMap.get(title);
        if (body && body.style.maxHeight !== '0px') {
            // 只有在展开状态时才更新高度
            body.style.maxHeight = body.scrollHeight + 'px';
        }
    }
    
    switches.forEach(switchBtn => {
        switchBtn.addEventListener('click', function() {
            const isChecked = this.getAttribute('aria-checked') === 'true';
            const newState = !isChecked;
            
            // 更新按钮状态
            this.setAttribute('aria-checked', newState);
            this.setAttribute('data-state', newState ? 'checked' : 'unchecked');
            
            // 更新关联的隐藏复选框
            const checkbox = this.nextElementSibling;
            if (checkbox && checkbox.type === 'checkbox') {
                checkbox.checked = newState;
            }
            
            // 更新圆点位置
            const thumb = this.querySelector('span');
            if (thumb) {
                thumb.setAttribute('data-state', newState ? 'checked' : 'unchecked');
            }
            
            // 如果是"等待回复"开关，控制行为识别模块显示/隐藏
            if (this.id === 'waitReplySwitch' && behaviorConfigContainer) {
                if (newState) {
                    // 开启：显示行为识别模块
                    behaviorConfigContainer.style.display = 'block';
                    // 添加淡入动画
                    behaviorConfigContainer.style.opacity = '0';
                    behaviorConfigContainer.style.transform = 'translateY(-10px)';
                    setTimeout(() => {
                        behaviorConfigContainer.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
                        behaviorConfigContainer.style.opacity = '1';
                        behaviorConfigContainer.style.transform = 'translateY(0)';
                        // 更新手风琴高度
                        setTimeout(() => updateAccordionHeight('等待回复'), 50);
                    }, 10);
                } else {
                    // 关闭：隐藏行为识别模块
                    behaviorConfigContainer.style.transition = 'opacity 0.2s ease, transform 0.2s ease';
                    behaviorConfigContainer.style.opacity = '0';
                    behaviorConfigContainer.style.transform = 'translateY(-10px)';
                    setTimeout(() => {
                        behaviorConfigContainer.style.display = 'none';
                        // 更新手风琴高度
                        updateAccordionHeight('等待回复');
                    }, 200);
                }
            }
        });
    });

    // ==================== 手风琴折叠/展开功能 ====================
    const accordionHeaders = document.querySelectorAll('.accord_item_header');
    
    accordionHeaders.forEach(header => {
        const collapseBtn = header.querySelector('.accord_item_collapse-btn');
        const accordItem = header.closest('.accord_item');
        const body = accordItem.querySelector('.accord_item_body');
        
        if (collapseBtn && body) {
            // 存储body元素和对应的标题
            const title = accordItem.getAttribute('data-title');
            accordionBodiesMap.set(title, body);
            
            // 默认展开
            body.style.maxHeight = body.scrollHeight + 'px';
            body.style.overflow = 'visible';
            
            collapseBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                
                const isCollapsed = body.style.maxHeight === '0px';
                
                if (isCollapsed) {
                    // 展开
                    body.style.maxHeight = body.scrollHeight + 'px';
                    body.style.overflow = 'visible';
                    this.style.transform = 'rotate(0deg)';
                } else {
                    // 折叠
                    body.style.maxHeight = '0px';
                    body.style.overflow = 'hidden';
                    this.style.transform = 'rotate(-180deg)';
                }
            });
            
            // 整个标题可点击
            header.addEventListener('click', function() {
                collapseBtn.click();
            });
        }
    });

    // ==================== 新增意图按钮功能 ====================
    // 使用通用的选择器查找包含"新增意图"文本的按钮
    const buttons = document.querySelectorAll('button');
    buttons.forEach(btn => {
        if (btn.textContent.includes('新增意图')) {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                console.log('点击了新增意图按钮');
                // 这里可以添加新增意图的逻辑
                alert('新增意图功能演示');
            });
        }
    });

    // ==================== 输入框增减按钮功能 ====================
    const numberInput = document.querySelector('input[type="text"][value="0"]');
    if (numberInput) {
        const incrementBtn = numberInput.parentElement.querySelector('button:first-of-type');
        const decrementBtn = numberInput.parentElement.querySelector('button:last-of-type');
        
        if (incrementBtn) {
            incrementBtn.addEventListener('click', function(e) {
                e.preventDefault();
                let currentValue = parseInt(numberInput.value) || 0;
                numberInput.value = currentValue + 1;
            });
        }
        
        if (decrementBtn) {
            decrementBtn.addEventListener('click', function(e) {
                e.preventDefault();
                let currentValue = parseInt(numberInput.value) || 0;
                if (currentValue > 0) {
                    numberInput.value = currentValue - 1;
                }
            });
        }
        
        // 确保只能输入数字
        numberInput.addEventListener('input', function() {
            this.value = this.value.replace(/[^0-9]/g, '');
        });
    }

    // ==================== 鼠标悬停效果增强 ====================
    const hoverElements = document.querySelectorAll('.hover\\:bg-accent');
    hoverElements.forEach(element => {
        element.addEventListener('mouseenter', function() {
            this.style.transition = 'all 0.15s ease';
        });
    });

    // ==================== 输入框焦点效果 ====================
    const inputs = document.querySelectorAll('input[type="text"]');
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.style.outline = '1px solid var(--primary)';
            this.style.borderColor = 'var(--primary)';
        });
        
        input.addEventListener('blur', function() {
            this.style.outline = 'none';
            this.style.borderColor = 'rgb(var(--input))';
        });
    });

    console.log('顾客消息识别配置面板已加载完成');

    // ==================== 行为识别模块功能 ====================
    const behaviorMultiselectBox = document.getElementById('behaviorMultiselectBox');
    const behaviorDropdownList = document.getElementById('behaviorDropdownList');
    const behaviorSelectedTags = document.getElementById('behaviorSelectedTags');
    const behaviorDropdownItems = document.querySelectorAll('.behavior-dropdown-item');
    
    // 存储当前选中的行为数据
    let selectedBehaviorsData = [];
    let isBehaviorDropdownOpen = false;
    
    // 切换下拉列表
    function toggleBehaviorDropdown() {
        isBehaviorDropdownOpen = !isBehaviorDropdownOpen;
        
        if (isBehaviorDropdownOpen) {
            behaviorDropdownList.style.display = 'flex';
            behaviorMultiselectBox.classList.add('active');
        } else {
            behaviorDropdownList.style.display = 'none';
            behaviorMultiselectBox.classList.remove('active');
        }
        
            // 更新手风琴高度
        setTimeout(() => updateAccordionHeight('等待回复'), 50);
    }
    
    // 更新选中标签显示
    function updateBehaviorSelectedTags() {
        behaviorSelectedTags.innerHTML = '';
        
        if (selectedBehaviorsData.length === 0) {
            // 显示占位符
            const placeholder = document.createElement('span');
            placeholder.className = 'behavior-placeholder';
            placeholder.textContent = '请选择要识别的行为';
            behaviorSelectedTags.appendChild(placeholder);
        } else {
            // 显示所有已选标签
            selectedBehaviorsData.forEach(behavior => {
            const tag = document.createElement('div');
                tag.className = 'behavior-selected-tag';
                
                // 图标 - 使用原始SVG图标
                const iconWrapper = document.createElement('div');
                iconWrapper.className = 'behavior-selected-tag-icon';
                if (behavior.icon) {
                    iconWrapper.innerHTML = behavior.icon;
                    // 应用颜色到SVG
                    const svg = iconWrapper.querySelector('svg');
                    if (svg) {
                        svg.style.color = behavior.color;
                        // 更新stroke颜色
                        svg.querySelectorAll('[stroke]').forEach(el => {
                            if (el.getAttribute('stroke') === 'currentColor') {
                                el.setAttribute('stroke', behavior.color);
                            }
                        });
                        // 更新fill颜色
                        svg.querySelectorAll('[fill]').forEach(el => {
                            if (el.getAttribute('fill') === 'currentColor') {
                                el.setAttribute('fill', behavior.color);
                            }
                        });
                    }
                }
                tag.appendChild(iconWrapper);
                
                // 文字
                const text = document.createElement('span');
                text.className = 'behavior-selected-tag-text';
                text.textContent = behavior.label;
                tag.appendChild(text);
                
                // 删除按钮
                const closeBtn = document.createElement('div');
                closeBtn.className = 'behavior-selected-tag-close';
                closeBtn.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="none" viewBox="0 0 16 16">
                        <path stroke="#6E6E6E" stroke-width="1.5" d="M4.5 4.5L11.5 11.5M11.5 4.5L4.5 11.5"/>
                </svg>
            `;
                closeBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                    toggleBehaviorSelection(behavior.value);
            });
                tag.appendChild(closeBtn);
            
                behaviorSelectedTags.appendChild(tag);
        });
        }
        
        // 更新手风琴高度
        setTimeout(() => updateAccordionHeight('等待回复'), 10);
    }
    
    // 更新下拉列表项的选中状态
    function updateBehaviorDropdownItems() {
        behaviorDropdownItems.forEach(item => {
            const value = item.getAttribute('data-value');
            const isSelected = selectedBehaviorsData.some(b => b.value === value);
            
            if (isSelected) {
                item.classList.add('selected');
            } else {
                item.classList.remove('selected');
            }
        });
    }
    
    // 切换选择状态
    function toggleBehaviorSelection(value) {
        const item = document.querySelector(`.behavior-dropdown-item[data-value="${value}"]`);
        if (!item) return;
        
        const label = item.getAttribute('data-label');
        const color = item.getAttribute('data-color');
        const icon = item.getAttribute('data-icon');
        
        // 检查是否已选中
        const existingIndex = selectedBehaviorsData.findIndex(b => b.value === value);
        
        if (existingIndex >= 0) {
            // 已选中，移除
            selectedBehaviorsData.splice(existingIndex, 1);
    } else {
            // 未选中，添加
            selectedBehaviorsData.push({ value, label, color, icon });
        }
        
        // 更新显示
        updateBehaviorSelectedTags();
        updateBehaviorDropdownItems();
    }
    
    // 绑定输入框点击事件
    if (behaviorMultiselectBox) {
        behaviorMultiselectBox.addEventListener('click', function(e) {
            e.stopPropagation();
            toggleBehaviorDropdown();
        });
        console.log('多选下拉框已绑定事件');
            } else {
        console.error('未找到多选下拉框元素');
    }
    
    // 绑定下拉列表项点击事件
    behaviorDropdownItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.stopPropagation();
            const value = this.getAttribute('data-value');
            toggleBehaviorSelection(value);
        });
    });
    
    // 点击外部关闭下拉列表
    document.addEventListener('click', function(e) {
        if (isBehaviorDropdownOpen && 
            !behaviorMultiselectBox.contains(e.target) && 
            !behaviorDropdownList.contains(e.target)) {
            toggleBehaviorDropdown();
        }
    });
    
    // 初始化显示
    updateBehaviorSelectedTags();
    updateBehaviorDropdownItems();
    
    // 初始化后更新一次手风琴高度
    setTimeout(() => updateAccordionHeight('等待回复'), 100);
    
    console.log('行为识别模块已加载完成');
    console.log('behaviorDropdownList:', behaviorDropdownList);
    console.log('behaviorMultiselectBox:', behaviorMultiselectBox);

    // ==================== 关键词识别模块功能 ====================
    
    // 1. 分支折叠/展开（旧的关键词识别模块，现在已废弃，但保留以防万一）
    const branchCollapseBtns = document.querySelectorAll('.branch-collapse-btn');
    branchCollapseBtns.forEach(branchCollapseBtn => {
        const conditionBranch = branchCollapseBtn.closest('.condition-branch');
        if (!conditionBranch) return; // 如果不在旧的关键词识别结构中，跳过
        
        const branchBody = conditionBranch.querySelector('.condition-branch_body');
        
        if (branchCollapseBtn && branchBody) {
            branchCollapseBtn.addEventListener('click', function(e) {
                e.preventDefault(); // 阻止表单提交
                e.stopPropagation();
                const isCollapsed = branchBody.style.display === 'none';
                branchBody.style.display = isCollapsed ? 'block' : 'none';
                branchCollapseBtn.querySelector('svg').style.transform = isCollapsed ? 'rotate(0deg)' : 'rotate(-180deg)';
            });
        }
    });
    
    // 2. 删除关键词标签
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('remove-tag') || e.target.closest('.remove-tag')) {
            e.preventDefault(); // 阻止表单提交
            const tag = e.target.closest('.keyword-tag');
            if (tag) {
                // 添加淡出动画
                tag.style.transition = 'opacity 0.2s ease, transform 0.2s ease';
                tag.style.opacity = '0';
                tag.style.transform = 'scale(0.8)';
                setTimeout(() => {
                    tag.remove();
                }, 200);
            }
        }
    });
    
    // 3. 删除条件行
    document.addEventListener('click', function(e) {
        const deleteBtn = e.target.closest('.delete-btn');
        if (deleteBtn) {
            console.log('点击了删除条件按钮');
            const conditionRow = deleteBtn.closest('.condition-row');
            if (conditionRow) {
                const conditionBox = conditionRow.closest('.condition-box');
                const conditionGroup = conditionBox.closest('.condition-group');
                const keywordSection = conditionRow.closest('.keyword-section');
                const rows = conditionBox.querySelectorAll('.condition-row');
                
                if (rows.length > 1) {
                    // 如果还有多个条件，直接删除当前条件行
                    conditionRow.remove();
                } else {
                    // 只剩最后一个条件了
                    const branchBody = conditionGroup.closest('.condition-branch_body');
                    const allGroups = branchBody.querySelectorAll('.condition-group');
                    
                    // 如果不是第一个条件组（是通过"或者"添加的），可以删除整个组
                    if (allGroups.length > 1 && conditionGroup !== allGroups[0]) {
                        // 查找并删除该组前面的"或者"分隔符
                        let prevElement = conditionGroup.previousElementSibling;
                        if (prevElement && prevElement.classList.contains('divider')) {
                            prevElement.remove();
                        }
                        // 删除整个条件组
                        conditionGroup.remove();
                        
                        // 更新关键词计数
                        if (keywordSection) {
                            updateKeywordCount(keywordSection);
                        }
                    } else {
                        // 第一个条件组至少保留一个条件
                        alert('至少需要保留一个条件');
                    }
                }
            }
        }
    });
    
    // 4. 关键词输入框功能
    const keywordInputs = document.querySelectorAll('.keyword-input');
    
    keywordInputs.forEach(input => {
        input.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' && input.value.trim()) {
                e.preventDefault();
                addKeywordTag(input, input.value.trim());
                input.value = '';
            }
        });
        
        input.addEventListener('blur', function() {
            if (input.value.trim()) {
                addKeywordTag(input, input.value.trim());
                input.value = '';
            }
        });
    });
    
    // 添加关键词标签的辅助函数
    function addKeywordTag(input, text) {
        const tag = document.createElement('div');
        tag.className = 'keyword-tag';
        tag.innerHTML = `
            <span>${text}</span>
            <button class="remove-tag">×</button>
        `;
        
        input.parentNode.insertBefore(tag, input);
        
        // 添加淡入动画
        tag.style.opacity = '0';
        tag.style.transform = 'scale(0.8)';
        setTimeout(() => {
            tag.style.transition = 'opacity 0.2s ease, transform 0.2s ease';
            tag.style.opacity = '1';
            tag.style.transform = 'scale(1)';
        }, 10);
    }
    
    // 5. 添加"并且"条件
    document.addEventListener('click', function(e) {
        const addConditionBtn = e.target.closest('.add-condition-btn');
        if (addConditionBtn) {
            e.preventDefault(); // 阻止表单提交
            console.log('点击了并且按钮');
            const btn = addConditionBtn;
            const conditionBox = btn.closest('.condition-box');
            
            // 创建新的条件行
            const newRow = document.createElement('div');
            newRow.className = 'condition-row';
            newRow.innerHTML = `
                <select class="condition-select">
                    <option value="contains" selected>包含</option>
                    <option value="not_contains">不包含</option>
                </select>
                <div class="keywords-input">
                    <input type="text" placeholder="" class="keyword-input">
                </div>
                <button class="delete-btn" title="删除">
                    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="none" viewBox="0 0 16 16">
                        <path stroke="currentColor" d="M9.5 7V11M6 2.5H10M2 4.5H14M12.5 4.5V13.5H3.5V4.5M6.5 7V11" />
                    </svg>
                </button>
            `;
            
            // 插入到按钮之前
            conditionBox.insertBefore(newRow, btn);
            
            // 添加淡入动画
            newRow.style.opacity = '0';
            newRow.style.transform = 'translateY(-10px)';
            setTimeout(() => {
                newRow.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
                newRow.style.opacity = '1';
                newRow.style.transform = 'translateY(0)';
            }, 10);
            
            // 为新输入框添加事件
            const newInput = newRow.querySelector('.keyword-input');
            addKeywordInputEvents(newInput);
        }
    });
    
    // 6. 添加"或者"条件组
    document.addEventListener('click', function(e) {
        const addGroupBtn = e.target.closest('.add-group-btn');
        if (addGroupBtn) {
            e.preventDefault(); // 阻止表单提交
            console.log('点击了或者按钮');
            const btn = addGroupBtn;
            const branchBody = btn.closest('.section-content');
            const keywordSection = btn.closest('.keyword-section');
            
            // 创建"或者"分隔符
            const divider = document.createElement('div');
            divider.className = 'divider';
            divider.textContent = '或者';
            
            // 创建新的条件组
            const newGroup = document.createElement('div');
            newGroup.className = 'condition-group';
            newGroup.innerHTML = `
                <div class="condition-box">
                    <div class="condition-row">
                        <select class="condition-select">
                            <option value="contains" selected>包含</option>
                            <option value="not_contains">不包含</option>
                        </select>
                        <div class="keywords-input">
                            <input type="text" placeholder="" class="keyword-input">
                        </div>
                        <button class="delete-btn" title="删除">
                            <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="none" viewBox="0 0 16 16">
                                <path stroke="currentColor" d="M9.5 7V11M6 2.5H10M2 4.5H14M12.5 4.5V13.5H3.5V4.5M6.5 7V11" />
                            </svg>
                        </button>
                    </div>
                    <button class="add-condition-btn">
                        <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="none" viewBox="0 0 16 16">
                            <path stroke="currentColor" d="M3 8H13M8 3V13" />
                        </svg>
                        并且
                    </button>
                </div>
            `;
            
            // 先插入分隔符，再插入条件组
            branchBody.insertBefore(divider, btn);
            branchBody.insertBefore(newGroup, btn);
            
            // 添加淡入动画
            divider.style.opacity = '0';
            newGroup.style.opacity = '0';
            newGroup.style.transform = 'translateY(-10px)';
            setTimeout(() => {
                divider.style.transition = 'opacity 0.3s ease';
                divider.style.opacity = '1';
                newGroup.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
                newGroup.style.opacity = '1';
                newGroup.style.transform = 'translateY(0)';
            }, 10);
            
            // 为新输入框添加事件
            const newInput = newGroup.querySelector('.keyword-input');
            addKeywordInputEvents(newInput);
            
            // 更新关键词计数
            if (keywordSection) {
                updateKeywordCount(keywordSection);
            }
        }
    });
    
    // 7. 新增分支 - 已移至顾客消息识别模块统一处理
    
    // 为输入框添加事件的辅助函数
    function addKeywordInputEvents(input) {
        input.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' && input.value.trim()) {
                e.preventDefault();
                const keywordText = input.value.trim();
                addKeywordTag(input, keywordText);
                input.value = '';
                
                // 添加一个轻微的闪烁效果表示添加成功
                const keywordsInput = input.closest('.keywords-input');
                keywordsInput.style.borderColor = 'var(--primary)';
                setTimeout(() => {
                    keywordsInput.style.borderColor = '';
                }, 300);
            }
        });
        
        input.addEventListener('blur', function() {
            if (input.value.trim()) {
                addKeywordTag(input, input.value.trim());
                input.value = '';
            }
        });
        
        // 添加焦点样式
        input.addEventListener('focus', function() {
            const keywordsInput = input.closest('.keywords-input');
            keywordsInput.style.borderColor = 'var(--primary)';
        });
        
        input.addEventListener('blur', function() {
            const keywordsInput = input.closest('.keywords-input');
            // 延迟一下，让回车键的效果先完成
            setTimeout(() => {
                keywordsInput.style.borderColor = '';
            }, 100);
        });
    }
    
    // 8. 编辑分支名称
    const editIcons = document.querySelectorAll('.edit-icon');
    editIcons.forEach(editIcon => {
        const branchTitle = editIcon.previousElementSibling;
        
        if (editIcon && branchTitle) {
            editIcon.addEventListener('click', function(e) {
                e.stopPropagation();
                const currentTitle = branchTitle.textContent;
                const newTitle = prompt('请输入分支名称:', currentTitle);
                if (newTitle && newTitle.trim()) {
                    branchTitle.textContent = newTitle.trim();
                }
            });
        }
    });
    
    console.log('关键词识别模块已加载完成');
    
    // ==================== 顾客消息识别模块功能 ====================
    
    console.log('正在注册顾客消息识别模块事件...');
    
    // 1. 删除整个识别区块（意图识别或关键词识别）
    document.addEventListener('click', function(e) {
        const sectionDeleteBtn = e.target.closest('.section-delete-btn');
        if (sectionDeleteBtn) {
            e.preventDefault(); // 阻止表单提交
            console.log('点击了区块删除按钮');
            const section = sectionDeleteBtn.closest('.intent-section, .keyword-section');
            if (!section) {
                console.error('未找到section元素');
                return;
            }
            const branch = section.closest('.message-branch');
            const isIntentSection = section.classList.contains('intent-section');
            const isKeywordSection = section.classList.contains('keyword-section');
            
            // 确认删除
            const sectionName = isIntentSection ? '意图识别' : '关键词识别';
            if (confirm(`确定要删除整个${sectionName}区块吗？`)) {
                // 隐藏区块
                section.style.display = 'none';
                
                // 显示对应的添加按钮
                const addButtons = branch.querySelector('.add-section-buttons');
                if (isIntentSection) {
                    const addIntentBtn = addButtons.querySelector('.add-intent-section-btn');
                    addIntentBtn.style.display = 'inline-flex';
                } else {
                    const addKeywordBtn = addButtons.querySelector('.add-keyword-section-btn');
                    addKeywordBtn.style.display = 'inline-flex';
                }
                
                // 检查是否需要隐藏"或"分隔符
                updateOrDividerVisibility(branch);
            }
        }
    });
    
    // 2. 添加识别区块
    document.addEventListener('click', function(e) {
        const addIntentBtn = e.target.closest('.add-intent-section-btn');
        const addKeywordBtn = e.target.closest('.add-keyword-section-btn');
        
        if (addIntentBtn || addKeywordBtn) {
            e.preventDefault(); // 阻止表单提交
            const branch = e.target.closest('.message-branch');
            const isIntent = !!addIntentBtn;
            
            if (isIntent) {
                // 显示意图识别区块
                const intentSection = branch.querySelector('.intent-section');
                intentSection.style.display = 'block';
                addIntentBtn.style.display = 'none';
                
                // 更新问法计数
                updateQuestionCount(intentSection);
            } else {
                // 显示关键词识别区块
                const keywordSection = branch.querySelector('.keyword-section');
                keywordSection.style.display = 'block';
                addKeywordBtn.style.display = 'none';
                
                // 绑定关键词区块的交互事件
                bindKeywordSectionEvents(keywordSection);
            }
            
            // 检查是否需要显示"或"分隔符
            updateOrDividerVisibility(branch);
        }
    });
    
    // 3. 新增问法
    document.addEventListener('click', function(e) {
        const addQuestionBtn = e.target.closest('.add-question-btn');
        if (addQuestionBtn) {
            e.preventDefault(); // 阻止表单提交
            console.log('点击了新增问法按钮');
            const btn = addQuestionBtn;
            const questionsList = btn.closest('.user-questions-field').querySelector('.user-questions-list');
            
            // 创建新的问法项
            const newQuestion = document.createElement('div');
            newQuestion.className = 'question-item';
            newQuestion.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 16 16" class="question-icon">
                    <path stroke="currentColor" d="M13.5 8C13.5 11.0376 11.0376 13.5 8 13.5C4.96243 13.5 2.5 11.0376 2.5 8C2.5 4.96243 4.96243 2.5 8 2.5C11.0376 2.5 13.5 4.96243 13.5 8Z" />
                    <path stroke="currentColor" d="M8 8V11M8 5V5.5" />
                </svg>
                <input type="text" class="question-input" placeholder="输入用户可能的提问方式" value="">
                <button class="question-delete-btn" title="删除">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 16 16">
                        <path stroke="currentColor" d="M4.5 4.5L11.5 11.5M11.5 4.5L4.5 11.5" />
                    </svg>
                </button>
            `;
            
            questionsList.appendChild(newQuestion);
            
            // 添加淡入动画
            newQuestion.style.opacity = '0';
            newQuestion.style.transform = 'translateY(-10px)';
            setTimeout(() => {
                newQuestion.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
                newQuestion.style.opacity = '1';
                newQuestion.style.transform = 'translateY(0)';
            }, 10);
            
            // 自动聚焦到新输入框
            const newInput = newQuestion.querySelector('.question-input');
            setTimeout(() => {
                newInput.focus();
            }, 100);
            
            // 切换按钮状态（从空状态到正常状态）
            updateAddQuestionButtonState(btn);
            
            // 更新问法数量
            updateQuestionCount(btn.closest('.intent-section'));
        }
    });
    
    // 4. 删除问法项
    document.addEventListener('click', function(e) {
        const questionDeleteBtn = e.target.closest('.question-delete-btn');
        if (questionDeleteBtn) {
            e.preventDefault(); // 阻止表单提交
            console.log('点击了删除问法按钮');
            const btn = questionDeleteBtn;
            const questionItem = btn.closest('.question-item');
            const intentSection = questionItem.closest('.intent-section');
            const questionsList = questionItem.closest('.user-questions-list');
            const addQuestionBtn = intentSection.querySelector('.add-question-btn');
            
            // 用户问法是可选的，可以全部删除
            
            // 添加淡出动画
            questionItem.style.transition = 'opacity 0.2s ease, transform 0.2s ease';
            questionItem.style.opacity = '0';
            questionItem.style.transform = 'translateX(-20px)';
            setTimeout(() => {
                questionItem.remove();
                
                // 切换按钮状态（如果删除后为空，恢复空状态样式）
                updateAddQuestionButtonState(addQuestionBtn);
                
                // 更新计数
                updateQuestionCount(intentSection);
            }, 200);
        }
    });
    
    // 5. 更新问法计数
    function updateQuestionCount(intentSection) {
        const count = intentSection.querySelectorAll('.question-item').length;
        const countSpan = intentSection.querySelector('.section-count');
        if (countSpan) {
            if (count === 0) {
                countSpan.textContent = `(未配置问法)`;
            } else {
                countSpan.textContent = `(已配置${count}个问法)`;
            }
        }
    }
    
    // 5.5 更新新增问法按钮状态（空状态 vs 正常状态）
    function updateAddQuestionButtonState(btn) {
        if (!btn) return;
        
        const questionsField = btn.closest('.user-questions-field');
        const questionsList = questionsField.querySelector('.user-questions-list');
        const fieldLabel = questionsField.querySelector('.field-label');
        const count = questionsList.querySelectorAll('.question-item').length;
        
        if (count === 0) {
            // 切换到空状态：隐藏label，按钮显示完整信息
            if (fieldLabel) {
                fieldLabel.style.display = 'none';
            }
            btn.classList.add('add-question-btn-empty');
            btn.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 16 16">
                    <path stroke="currentColor" d="M3 8H13M8 3V13" />
                </svg>
                <div class="btn-content">
                    <span class="btn-title">用户问法<span class="field-optional">（可选）</span></span>
                    <span class="btn-hint">点击添加用户可能的提问方式</span>
                </div>
            `;
        } else {
            // 切换到正常状态：显示label，按钮变小
            if (fieldLabel) {
                fieldLabel.style.display = 'block';
            }
            btn.classList.remove('add-question-btn-empty');
            btn.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 16 16">
                    <path stroke="currentColor" d="M3 8H13M8 3V13" />
                </svg>
                新增问法
            `;
        }
    }
    
    // 5.1 为问法输入框添加即时反馈
    document.addEventListener('input', function(e) {
        if (e.target.classList.contains('question-input')) {
            const input = e.target;
            const questionItem = input.closest('.question-item');
            
            // 如果输入框为空，添加警告样式
            if (input.value.trim() === '') {
                questionItem.style.borderColor = 'rgba(243, 38, 64, 0.3)';
            } else {
                questionItem.style.borderColor = '';
            }
        }
    });
    
    // 5.2 为意图输入框添加失焦验证
    document.addEventListener('blur', function(e) {
        if (e.target.classList.contains('intent-input')) {
            const input = e.target;
            const intentItem = input.closest('.intent-item');
            
            // 如果输入框为空，提示用户
            if (input.value.trim() === '') {
                intentItem.style.borderColor = 'var(--primary)';
                setTimeout(() => {
                    intentItem.style.borderColor = '';
                }, 2000);
            }
        }
    }, true);
    
    // 6. 更新关键词计数
    function updateKeywordCount(keywordSection) {
        const count = keywordSection.querySelectorAll('.condition-group').length;
        const countSpan = keywordSection.querySelector('.section-count');
        if (countSpan) {
            countSpan.textContent = `(已配置${count}组)`;
        }
    }
    
    // 6.1 为关键词区块内的输入框绑定事件
    function bindKeywordSectionEvents(keywordSection) {
        // 为所有关键词输入框添加事件
        const keywordInputs = keywordSection.querySelectorAll('.keyword-input');
        keywordInputs.forEach(input => {
            addKeywordInputEvents(input);
        });
        
        // 更新计数
        updateKeywordCount(keywordSection);
    }
    
    // 7. 更新"或"分隔符显示/隐藏
    function updateOrDividerVisibility(branch) {
        const intentSection = branch.querySelector('.intent-section');
        const keywordSection = branch.querySelector('.keyword-section');
        const orDivider = branch.querySelector('.or-divider');
        
        const intentVisible = intentSection && intentSection.style.display !== 'none';
        const keywordVisible = keywordSection && keywordSection.style.display !== 'none';
        
        // 只有两个区块都显示时，才显示"或"分隔符
        if (orDivider) {
            orDivider.style.display = (intentVisible && keywordVisible) ? 'flex' : 'none';
        }
    }
    
    // 8. 编辑分支名称（消息分支）
    const messageEditIcons = document.querySelectorAll('.message-branch .edit-icon');
    messageEditIcons.forEach(editIcon => {
        const branchTitle = editIcon.previousElementSibling;
        
        if (editIcon && branchTitle) {
            editIcon.addEventListener('click', function(e) {
                e.stopPropagation();
                const currentTitle = branchTitle.textContent;
                const newTitle = prompt('请输入分支名称:', currentTitle);
                if (newTitle && newTitle.trim()) {
                    branchTitle.textContent = newTitle.trim();
                }
            });
        }
    });
    
    // 9. 分支折叠/展开（消息分支）
    const messageBranchCollapseBtns = document.querySelectorAll('.message-branch .branch-collapse-btn');
    messageBranchCollapseBtns.forEach(collapseBtn => {
        const branch = collapseBtn.closest('.message-branch');
        const branchBody = branch.querySelector('.message-branch_body');
        
        if (collapseBtn && branchBody) {
            collapseBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                const isCollapsed = branchBody.style.display === 'none';
                branchBody.style.display = isCollapsed ? 'block' : 'none';
                collapseBtn.querySelector('svg').style.transform = isCollapsed ? 'rotate(0deg)' : 'rotate(-180deg)';
            });
        }
    });
    
    // 10. 新增分支
    document.addEventListener('click', function(e) {
        const addBranchBtn = e.target.closest('.add-branch-btn-empty, .add-branch-btn');
        if (addBranchBtn) {
            e.preventDefault(); // 阻止表单提交
            console.log('点击了新增分支按钮');
            const container = document.querySelector('.message-recognition-container');
            const defaultBranch = container.querySelector('.default-branch');
            const existingBranches = container.querySelectorAll('.message-branch');
            const branchNumber = existingBranches.length + 1;
            
            // 创建新分支
            const newBranch = document.createElement('div');
            newBranch.className = 'message-branch';
            newBranch.setAttribute('data-branch-id', branchNumber);
            newBranch.innerHTML = `
                <div class="message-branch_header">
                    <div class="branch-title-group">
                        <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="none" viewBox="0 0 16 16" class="branch-icon">
                            <path stroke="currentColor" d="M5 13.5H2.5V11M5 5.5H8M8 5.5H11M8 5.5V11M2.5 5V2.5H5M11 13.5H13.5V11M13.5 5V2.5H11" />
                        </svg>
                        <div class="branch-title">分支-${branchNumber}</div>
                        <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="none" viewBox="0 0 16 16" class="edit-icon">
                            <path stroke="currentColor" d="M2 13.5H14M3.77541 8.217L9.99241 2L12.1137 4.12132L5.89673 10.3383L3.32966 10.8936L3.77541 8.217Z" />
                        </svg>
                    </div>
                    <div class="branch-header-actions">
                        <button class="branch-delete-btn" title="删除分支">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 16 16">
                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" d="M9.5 7V11M6 2.5H10M2 4.5H14M12.5 4.5V13.5H3.5V4.5M6.5 7V11" />
                            </svg>
                        </button>
                        <div class="branch-collapse-btn">
                            <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="none" viewBox="0 0 16 16">
                                <path stroke="currentColor" d="M4.5 6L8 9.5L11.5 6" />
                            </svg>
                        </div>
                    </div>
                </div>
                
                <div class="message-branch_body">
                    <!-- 意图识别区块 -->
                    <div class="intent-section" style="display: none;">
                        <div class="section-header">
                            <div class="section-title-group">
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 16 16" class="section-icon">
                                    <path stroke="currentColor" d="M8 11V5M5.5 9C5.99445 9 6.4778 9.14662 6.88893 9.42133C7.30005 9.69603 7.62048 10.0865 7.8097 10.5433C7.99892 11.0001 8.04843 11.5028 7.95196 11.9877C7.8555 12.4727 7.6174 12.9181 7.26777 13.2678C6.91814 13.6174 6.47268 13.8555 5.98773 13.952C5.50277 14.0484 5.00011 13.9989 4.54329 13.8097C4.08648 13.6205 3.69603 13.3 3.42133 12.8889C3.14662 12.4778 3 11.9945 3 11.5V11.0813M10.5 9C10.0055 9 9.5222 9.14662 9.11108 9.42133C8.69995 9.69603 8.37952 10.0865 8.1903 10.5433C8.00108 11.0001 7.95157 11.5028 8.04804 11.9877C8.1445 12.4727 8.3826 12.9181 8.73223 13.2678C9.08187 13.6174 9.52732 13.8555 10.0123 13.952C10.4972 14.0484 10.9999 13.9989 11.4567 13.8097C11.9135 13.6205 12.304 13.3 12.5787 12.8889C12.8534 12.4778 13 11.9945 13 11.5V11.0813M4.5 11.25H4C3.29089 11.2519 2.60403 11.0026 2.06128 10.5462C1.51852 10.0898 1.15497 9.45599 1.03511 8.75708C0.915257 8.05817 1.04685 7.3394 1.40654 6.72828C1.76623 6.11716 2.33077 5.65322 3 5.41875V4.5C3 3.83696 3.26339 3.20107 3.73223 2.73223C4.20107 2.26339 4.83696 2 5.5 2C6.16304 2 6.79893 2.26339 7.26777 2.73223C7.73661 3.20107 8 3.83696 8 4.5M8 4.5V11.5M8 4.5C8 3.83696 8.26339 3.20107 8.73223 2.73223C9.20107 2.26339 9.83696 2 10.5 2C11.163 2 11.7989 2.26339 12.2678 2.73223C12.7366 3.20107 13 3.83696 13 4.5V5.41875C13.6692 5.65322 14.2338 6.11716 14.5935 6.72828C14.9532 7.3394 15.0847 8.05817 14.9649 8.75708C14.845 9.45599 14.4815 10.0898 13.9387 10.5462C13.396 11.0026 12.7091 11.2519 12 11.25H11.5M5.5 5.25V5.75C5.5 6.21413 5.31563 6.65925 4.98744 6.98744C4.65925 7.31563 4.21413 7.5 3.75 7.5M10.5 5.25V5.75C10.5 6.21413 10.6844 6.65925 11.0126 6.98744C11.3408 7.31563 11.7859 7.5 12.25 7.5" />
                                </svg>
                                <span class="section-title">意图识别</span>
                                <span class="section-count">(未配置问法)</span>
                            </div>
                            <button class="section-delete-btn" title="删除整个意图识别">
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 16 16">
                                    <path stroke="currentColor" d="M9.5 7V11M6 2.5H10M2 4.5H14M12.5 4.5V13.5H3.5V4.5M6.5 7V11" />
                                </svg>
                            </button>
                        </div>
                        <div class="section-content">
                            <!-- 意图名称输入 -->
                            <div class="intent-name-field">
                                <label class="field-label">意图名称</label>
                                <div class="intent-name-input-wrapper">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 16 16" class="field-icon">
                                        <path stroke="currentColor" d="M8 11V5M5.5 9C5.99445 9 6.4778 9.14662 6.88893 9.42133C7.30005 9.69603 7.62048 10.0865 7.8097 10.5433C7.99892 11.0001 8.04843 11.5028 7.95196 11.9877C7.8555 12.4727 7.6174 12.9181 7.26777 13.2678C6.91814 13.6174 6.47268 13.8555 5.98773 13.952C5.50277 14.0484 5.00011 13.9989 4.54329 13.8097C4.08648 13.6205 3.69603 13.3 3.42133 12.8889C3.14662 12.4778 3 11.9945 3 11.5V11.0813M10.5 9C10.0055 9 9.5222 9.14662 9.11108 9.42133C8.69995 9.69603 8.37952 10.0865 8.1903 10.5433C8.00108 11.0001 7.95157 11.5028 8.04804 11.9877C8.1445 12.4727 8.3826 12.9181 8.73223 13.2678C9.08187 13.6174 9.52732 13.8555 10.0123 13.952C10.4972 14.0484 10.9999 13.9989 11.4567 13.8097C11.9135 13.6205 12.304 13.3 12.5787 12.8889C12.8534 12.4778 13 11.9945 13 11.5V11.0813M4.5 11.25H4C3.29089 11.2519 2.60403 11.0026 2.06128 10.5462C1.51852 10.0898 1.15497 9.45599 1.03511 8.75708C0.915257 8.05817 1.04685 7.3394 1.40654 6.72828C1.76623 6.11716 2.33077 5.65322 3 5.41875V4.5C3 3.83696 3.26339 3.20107 3.73223 2.73223C4.20107 2.26339 4.83696 2 5.5 2C6.16304 2 6.79893 2.26339 7.26777 2.73223C7.73661 3.20107 8 3.83696 8 4.5M8 4.5V11.5M8 4.5C8 3.83696 8.26339 3.20107 8.73223 2.73223C9.20107 2.26339 9.83696 2 10.5 2C11.163 2 11.7989 2.26339 12.2678 2.73223C12.7366 3.20107 13 3.83696 13 4.5V5.41875C13.6692 5.65322 14.2338 6.11716 14.5935 6.72828C14.9532 7.3394 15.0847 8.05817 14.9649 8.75708C14.845 9.45599 14.4815 10.0898 13.9387 10.5462C13.396 11.0026 12.7091 11.2519 12 11.25H11.5M5.5 5.25V5.75C5.5 6.21413 5.31563 6.65925 4.98744 6.98744C4.65925 7.31563 4.21413 7.5 3.75 7.5M10.5 5.25V5.75C10.5 6.21413 10.6844 6.65925 11.0126 6.98744C11.3408 7.31563 11.7859 7.5 12.25 7.5" />
                                    </svg>
                                    <input type="text" class="intent-name-input" placeholder="如:退款处理、售后咨询等" value="">
                                </div>
                            </div>
                            
                            <!-- 用户问法列表 -->
                            <div class="user-questions-field">
                                <label class="field-label" style="display: none;">用户问法<span class="field-optional">（可选）</span></label>
                                <div class="user-questions-list">
                                    <!-- 初始为空，用户可按需添加 -->
                                </div>
                                <button class="add-question-btn add-question-btn-empty">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 16 16">
                                        <path stroke="currentColor" d="M3 8H13M8 3V13" />
                                    </svg>
                                    <div class="btn-content">
                                        <span class="btn-title">用户问法<span class="field-optional">（可选）</span></span>
                                        <span class="btn-hint">点击添加用户可能的提问方式</span>
                                    </div>
                                </button>
                            </div>
                        </div>
                    </div>
                    
                    <!-- "或"分隔符 -->
                    <div class="or-divider" style="display: none;">
                        <div class="or-line"></div>
                        <div class="or-badge">
                            <span class="or-text">任一即可</span>
                        </div>
                        <div class="or-line"></div>
                    </div>
                    
                    <!-- 关键词识别区块 -->
                    <div class="keyword-section" style="display: none;">
                        <div class="section-header">
                            <div class="section-title-group">
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 16 16" class="section-icon">
                                    <path stroke="currentColor" d="M8 2V14M2 8H14"/>
                                </svg>
                                <span class="section-title">关键词识别</span>
                                <span class="section-count">(已配置1组)</span>
                            </div>
                            <button class="section-delete-btn" title="删除整个关键词识别">
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 16 16">
                                    <path stroke="currentColor" d="M9.5 7V11M6 2.5H10M2 4.5H14M12.5 4.5V13.5H3.5V4.5M6.5 7V11" />
                                </svg>
                            </button>
                        </div>
                        <div class="section-content">
                            <div class="condition-group">
                                <div class="condition-box">
                                    <div class="condition-row">
                                        <select class="condition-select">
                                            <option value="contains" selected>包含</option>
                                            <option value="not_contains">不包含</option>
                                        </select>
                                        <div class="keywords-input">
                                            <input type="text" placeholder="" class="keyword-input">
                                        </div>
                                        <button class="delete-btn" title="删除条件">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="none" viewBox="0 0 16 16">
                                                <path stroke="currentColor" d="M9.5 7V11M6 2.5H10M2 4.5H14M12.5 4.5V13.5H3.5V4.5M6.5 7V11" />
                                            </svg>
                                        </button>
                                    </div>
                                    <button class="add-condition-btn">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="none" viewBox="0 0 16 16">
                                            <path stroke="currentColor" d="M3 8H13M8 3V13" />
                                        </svg>
                                        并且
                                    </button>
                                </div>
                            </div>
                            <button class="add-group-btn">
                                <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="none" viewBox="0 0 16 16">
                                    <path stroke="currentColor" d="M3 8H13M8 3V13" />
                                </svg>
                                或者
                            </button>
                        </div>
                    </div>
                    
                    <!-- 添加识别方式按钮组 -->
                    <div class="add-section-buttons">
                        <button class="add-section-btn add-intent-section-btn" style="display: inline-flex;">
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 16 16">
                                <path stroke="currentColor" d="M3 8H13M8 3V13" />
                            </svg>
                            添加意图识别
                        </button>
                        <button class="add-section-btn add-keyword-section-btn" style="display: inline-flex;">
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 16 16">
                                <path stroke="currentColor" d="M3 8H13M8 3V13" />
                            </svg>
                            添加关键词识别
                        </button>
                    </div>
                </div>
            `;
            
            // 在"新增分支"按钮之前插入
            const addBranchSection = container.querySelector('.add-branch-section-empty, .add-branch-section');
            container.insertBefore(newBranch, addBranchSection);
            
            // 如果之前是空状态,切换为普通样式
            if (existingBranches.length === 0) {
                toggleAddBranchStyle(container, false);
            }
            
            // 为新分支绑定编辑和折叠事件
            bindBranchEvents(newBranch);
            
            // 为新分支的关键词输入框添加事件
            const keywordInputs = newBranch.querySelectorAll('.keyword-input');
            keywordInputs.forEach(input => {
                addKeywordInputEvents(input);
            });
        }
    });
    
    // 11. 为分支绑定事件
    function bindBranchEvents(branch) {
        // 编辑按钮
        const editIcon = branch.querySelector('.edit-icon');
        const branchTitle = branch.querySelector('.branch-title');
        if (editIcon && branchTitle) {
            editIcon.addEventListener('click', function(e) {
                e.stopPropagation();
                const currentTitle = branchTitle.textContent;
                const newTitle = prompt('请输入分支名称:', currentTitle);
                if (newTitle && newTitle.trim()) {
                    branchTitle.textContent = newTitle.trim();
                }
            });
        }
        
        // 折叠按钮
        const collapseBtn = branch.querySelector('.branch-collapse-btn');
        const branchBody = branch.querySelector('.message-branch_body');
        if (collapseBtn && branchBody) {
            collapseBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                const isCollapsed = branchBody.style.display === 'none';
                branchBody.style.display = isCollapsed ? 'block' : 'none';
                collapseBtn.querySelector('svg').style.transform = isCollapsed ? 'rotate(0deg)' : 'rotate(-180deg)';
            });
        }
    }
    
    console.log('顾客消息识别模块已加载完成');
    
    // ==================== 兜底意图功能（已废弃，使用新的共享兜底分支） ====================
    // 旧代码已移除，避免与新的共享兜底分支功能冲突
    
    // ==================== 初始化已存在的区块 ====================
    
    // 为页面加载时已存在的所有关键词识别区块绑定事件
    document.querySelectorAll('.keyword-section').forEach(keywordSection => {
        if (keywordSection.style.display !== 'none') {
            bindKeywordSectionEvents(keywordSection);
        }
    });
    
    // 为页面加载时已存在的所有意图识别区块更新计数
    document.querySelectorAll('.intent-section').forEach(intentSection => {
        if (intentSection.style.display !== 'none') {
            updateQuestionCount(intentSection);
        }
    });
    
    console.log('所有识别区块已初始化完成');
    
    // 输出所有相关按钮的数量，用于调试
    console.log('===== 按钮统计 =====');
    console.log('新增意图按钮数量:', document.querySelectorAll('.add-intent-btn').length);
    console.log('意图删除按钮数量:', document.querySelectorAll('.intent-delete-btn').length);
    console.log('区块删除按钮数量:', document.querySelectorAll('.section-delete-btn').length);
    console.log('新增分支按钮数量(空状态):', document.querySelectorAll('.add-branch-btn-empty').length);
    console.log('新增分支按钮数量(普通):', document.querySelectorAll('.add-branch-btn').length);
    console.log('或者按钮数量:', document.querySelectorAll('.add-group-btn').length);
    console.log('并且按钮数量:', document.querySelectorAll('.add-condition-btn').length);
    console.log('条件删除按钮数量:', document.querySelectorAll('.delete-btn').length);
    console.log('分支删除按钮数量:', document.querySelectorAll('.branch-delete-btn').length);
    console.log('===== 统计结束 =====');
    
    // ==================== 共享兜底分支交互 ====================
    const fallbackSwitch = document.getElementById('fallbackIntentSwitch');
    const fallbackStatusCard = document.querySelector('.fallback-status-card');
    const configModal = document.getElementById('fallbackConfigModal');
    const openConfigBtn = document.getElementById('openConfigModal');
    const editConfigBtn = document.getElementById('editConfigModal');
    const closeModalBtn = document.getElementById('closeConfigModal');
    const cancelModalBtn = document.getElementById('cancelConfigModal');
    const saveModalBtn = document.getElementById('saveConfigModal');
    const modalOverlay = document.querySelector('.config-modal-overlay');
    
    // 模拟配置状态（实际应从后端获取）
    let isConfigured = false; // 是否已配置
    let configuredBranches = []; // 已配置的分支列表
    
    // 1. 开关切换
    if (fallbackSwitch) {
        // 使用防抖来避免重复触发
        let isToggling = false;
        
        fallbackSwitch.addEventListener('click', function(e) {
            // 防止事件重复触发
            if (isToggling) {
                console.log('⏸️ 正在切换中，忽略重复点击');
                return;
            }
            
            isToggling = true;
            
            // 停止事件冒泡
            e.stopPropagation();
            e.preventDefault();
            
            const isChecked = this.getAttribute('aria-checked') === 'true';
            const newState = !isChecked;
            
            console.log('🔘 开关点击 - 当前状态:', isChecked, '→ 新状态:', newState);
            
            // 更新开关状态
            this.setAttribute('aria-checked', newState);
            this.setAttribute('data-state', newState ? 'checked' : 'unchecked');
            
            const span = this.querySelector('span');
            if (span) {
                span.setAttribute('data-state', newState ? 'checked' : 'unchecked');
            }
            
            // 显示/隐藏状态卡片
            if (fallbackStatusCard) {
                const oldDisplay = fallbackStatusCard.style.display;
                fallbackStatusCard.style.display = newState ? 'block' : 'none';
                console.log('📋 状态卡片显示状态:', oldDisplay, '→', fallbackStatusCard.style.display);
                
                if (newState) {
                    // 根据是否已配置显示不同的卡片
                    updateStatusCard();
                    
                    // 检查按钮是否可见
                    setTimeout(() => {
                        const openBtn = document.getElementById('openConfigModal');
                        const editBtn = document.getElementById('editConfigModal');
                        console.log('🔍 检查按钮可见性:');
                        console.log('  - 立即配置按钮:', openBtn, '可见:', openBtn?.offsetParent !== null);
                        console.log('  - 配置共享分支按钮:', editBtn, '可见:', editBtn?.offsetParent !== null);
                    }, 100);
                }
            } else {
                console.warn('⚠️ fallbackStatusCard 未找到');
            }
            
            console.log('共享兜底分支', newState ? '已开启' : '已关闭');
            
            // 300ms后重置防抖标志
            setTimeout(() => {
                isToggling = false;
            }, 300);
        }, true); // 使用捕获阶段
        
        console.log('✓ 开关点击事件已绑定（带防抖）');
    } else {
        console.warn('✗ fallbackSwitch 未找到');
    }
    
    // 2. 更新状态卡片
    function updateStatusCard() {
        const emptyCard = document.querySelector('.status-card-empty');
        const configuredCard = document.querySelector('.status-card-configured');
        
        if (isConfigured && configuredBranches.length > 0) {
            // 显示已配置状态
            if (emptyCard) emptyCard.style.display = 'none';
            if (configuredCard) {
                configuredCard.style.display = 'flex';
                
                // 更新分支数量
                const branchCount = configuredCard.querySelector('.branch-count');
                if (branchCount) {
                    branchCount.textContent = configuredBranches.length;
                }
                
                // 更新分支预览
                const branchPreview = configuredCard.querySelector('.branch-preview');
                if (branchPreview) {
                    const names = configuredBranches.map(b => b.name).join('、');
                    branchPreview.textContent = names;
                }
            }
        } else {
            // 显示未配置状态
            if (emptyCard) emptyCard.style.display = 'flex';
            if (configuredCard) configuredCard.style.display = 'none';
        }
    }
    
    // 3. 打开配置 Modal
    function openModal() {
        if (configModal) {
            configModal.style.display = 'flex';
            document.body.style.overflow = 'hidden'; // 禁止背景滚动
            
            // 加载当前配置（如果有）
            loadModalConfig();
            
            console.log('打开共享兜底分支配置 Modal');
        }
    }
    
    // 4. 关闭配置 Modal
    function closeModal() {
        if (configModal) {
            configModal.style.display = 'none';
            document.body.style.overflow = ''; // 恢复滚动
            console.log('关闭共享兜底分支配置 Modal');
        }
    }
    
    // 5. 加载 Modal 配置内容
    function loadModalConfig() {
        const container = document.getElementById('fallbackBranchesContainer');
        if (!container) return;
        
        // 如果已有配置，显示现有配置
        if (isConfigured && configuredBranches.length > 0) {
            // TODO: 渲染已配置的分支
            container.innerHTML = '<div style="padding: 40px; text-align: center; color: var(--font-03);">已配置的分支列表将在这里显示<br/>（实际使用时会复用现有分支配置组件）</div>';
        } else {
            // 显示空状态提示
            container.innerHTML = `
                <div style="padding: 60px 20px; text-align: center;">
                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="none" viewBox="0 0 16 16" style="margin: 0 auto 16px; opacity: 0.3; display: block;">
                        <path stroke="currentColor" d="M5 13.5H2.5V11M5 5.5H8M8 5.5H11M8 5.5V11M2.5 5V2.5H5M11 13.5H13.5V11M13.5 5V2.5H11" />
                    </svg>
                    <div style="font-size: 14px; color: var(--font-03); margin-bottom: 16px;">尚未配置任何分支</div>
                    <button class="add-modal-branch-btn" style="margin: 0 auto; display: inline-flex; align-items: center; gap: 8px; padding: 6px 12px; border: 1px solid var(--border-color-border); border-radius: var(--border-radius-m); background: var(--background-base); color: var(--font-01); font-size: 14px; font-weight: 500; cursor: pointer; box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05); transition: all 0.2s;">
                        <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="none" viewBox="0 0 16 16">
                            <path stroke="currentColor" d="M3 8H13M8 3V13" />
                        </svg>
                        新增分支
                    </button>
                </div>
            `;
            
            // 为Modal内的新增分支按钮绑定事件
            const addModalBranchBtn = container.querySelector('.add-modal-branch-btn');
            if (addModalBranchBtn) {
                addModalBranchBtn.addEventListener('click', function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log('点击了Modal内的新增分支按钮');
                    addModalBranch();
                });
            }
        }
    }
    
    // 5.1 在Modal内添加分支
    function addModalBranch() {
        const container = document.getElementById('fallbackBranchesContainer');
        if (!container) return;
        
        console.log('在Modal内添加新分支');
        
        // 获取现有分支数量
        const existingBranches = container.querySelectorAll('.modal-branch-item');
        const branchNumber = existingBranches.length + 1;
        
        // 如果是第一个分支，清空空状态
        if (existingBranches.length === 0) {
            container.innerHTML = '<div class="modal-branches-list"></div>';
        }
        
        const branchList = container.querySelector('.modal-branches-list');
        
        // 创建新分支HTML
        const branchHTML = `
            <div class="modal-branch-item" data-branch-id="${branchNumber}">
                <div class="modal-branch-header">
                    <div class="modal-branch-title-group">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 16 16" style="color: var(--font-03);">
                            <path stroke="currentColor" d="M5 13.5H2.5V11M5 5.5H8M8 5.5H11M8 5.5V11M2.5 5V2.5H5M11 13.5H13.5V11M13.5 5V2.5H11" />
                        </svg>
                        <span class="modal-branch-title">分支-${branchNumber}</span>
                    </div>
                    <button class="modal-branch-delete-btn" data-branch-id="${branchNumber}" style="padding: 4px; background: transparent; border: none; cursor: pointer; color: var(--font-03); display: flex; align-items: center;">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 16 16">
                            <path stroke="currentColor" d="M9.5 7V11M6 2.5H10M2 4.5H14M12.5 4.5V13.5H3.5V4.5M6.5 7V11" />
                        </svg>
                    </button>
                </div>
                <div class="modal-branch-content">
                    <!-- 分支识别配置 -->
                    <div class="modal-branch-config-section">
                        <div class="modal-config-label">识别条件</div>
                        <div class="modal-config-placeholder">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 16 16" style="color: var(--font-03); opacity: 0.5;">
                                <path stroke="currentColor" d="M8 11V5M5.5 9C5.99445 9 6.4778 9.14662 6.88893 9.42133C7.30005 9.69603 7.62048 10.0865 7.8097 10.5433C7.99892 11.0001 8.04843 11.5028 7.95196 11.9877C7.8555 12.4727 7.6174 12.9181 7.26777 13.2678C6.91814 13.6174 6.47268 13.8555 5.98773 13.952C5.50277 14.0484 5.00011 13.9989 4.54329 13.8097C4.08648 13.6205 3.69603 13.3 3.42133 12.8889C3.14662 12.4778 3 11.9945 3 11.5V11.0813M10.5 9C10.0055 9 9.5222 9.14662 9.11108 9.42133C8.69995 9.69603 8.37952 10.0865 8.1903 10.5433C8.00108 11.0001 7.95157 11.5028 8.04804 11.9877C8.1445 12.4727 8.3826 12.9181 8.73223 13.2678C9.08187 13.6174 9.52732 13.8555 10.0123 13.952C10.4972 14.0484 10.9999 13.9989 11.4567 13.8097C11.9135 13.6205 12.304 13.3 12.5787 12.8889C12.8534 12.4778 13 11.9945 13 11.5V11.0813M4.5 11.25H4C3.29089 11.2519 2.60403 11.0026 2.06128 10.5462C1.51852 10.0898 1.15497 9.45599 1.03511 8.75708C0.915257 8.05817 1.04685 7.3394 1.40654 6.72828C1.76623 6.11716 2.33077 5.65322 3 5.41875V4.5C3 3.83696 3.26339 3.20107 3.73223 2.73223C4.20107 2.26339 4.83696 2 5.5 2C6.16304 2 6.79893 2.26339 7.26777 2.73223C7.73661 3.20107 8 3.83696 8 4.5M8 4.5V11.5M8 4.5C8 3.83696 8.26339 3.20107 8.73223 2.73223C9.20107 2.26339 9.83696 2 10.5 2C11.163 2 11.7989 2.26339 12.2678 2.73223C12.7366 3.20107 13 3.83696 13 4.5V5.41875C13.6692 5.65322 14.2338 6.11716 14.5935 6.72828C14.9532 7.3394 15.0847 8.05817 14.9649 8.75708C14.845 9.45599 14.4815 10.0898 13.9387 10.5462C13.396 11.0026 12.7091 11.2519 12 11.25H11.5M5.5 5.25V5.75C5.5 6.21413 5.31563 6.65925 4.98744 6.98744C4.65925 7.31563 4.21413 7.5 3.75 7.5M10.5 5.25V5.75C10.5 6.21413 10.6844 6.65925 11.0126 6.98744C11.3408 7.31563 11.7859 7.5 12.25 7.5" />
                            </svg>
                            <span style="font-size: 13px; color: var(--font-03);">配置意图识别或关键词识别条件</span>
                        </div>
                    </div>
                    
                    <!-- 跳转节点选择 -->
                    <div class="modal-branch-jump-section">
                        <div class="modal-config-label">
                            <span>命中后跳转到</span>
                            <span style="color: var(--primary);">*</span>
                        </div>
                        <div class="modal-jump-selector">
                            <select class="modal-jump-select" data-branch-id="${branchNumber}">
                                <option value="">请选择跳转节点</option>
                                <option value="node-1">发送消息</option>
                                <option value="node-2">AI 回复</option>
                                <option value="node-3">转人工客服</option>
                                <option value="node-4">结束对话</option>
                                <option value="node-5">其他识别节点</option>
                            </select>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 16 16" class="modal-jump-icon">
                                <path stroke="currentColor" d="M4.5 6L8 9.5L11.5 6" />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // 添加到列表
        if (branchList) {
            branchList.insertAdjacentHTML('beforeend', branchHTML);
        }
        
        // 确保有新增分支按钮
        let addBtn = container.querySelector('.add-modal-branch-btn');
        if (!addBtn) {
            container.insertAdjacentHTML('beforeend', `
                <button class="add-modal-branch-btn" style="margin-top: 16px; display: inline-flex; align-items: center; gap: 8px; padding: 6px 12px; border: 1px solid var(--border-color-border); border-radius: var(--border-radius-m); background: var(--background-base); color: var(--font-01); font-size: 14px; font-weight: 500; cursor: pointer; box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05); transition: all 0.2s;">
                    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="none" viewBox="0 0 16 16">
                        <path stroke="currentColor" d="M3 8H13M8 3V13" />
                    </svg>
                    新增分支
                </button>
            `);
            addBtn = container.querySelector('.add-modal-branch-btn');
        }
        
        // 绑定新增分支按钮
        if (addBtn) {
            // 移除旧的监听器，重新绑定
            const newAddBtn = addBtn.cloneNode(true);
            addBtn.parentNode.replaceChild(newAddBtn, addBtn);
            newAddBtn.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                console.log('继续添加更多分支');
                addModalBranch();
            });
        }
        
        // 绑定新添加分支的删除按钮
        const newDeleteBtn = container.querySelector(`[data-branch-id="${branchNumber}"].modal-branch-delete-btn`);
        if (newDeleteBtn) {
            newDeleteBtn.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                const branchId = this.getAttribute('data-branch-id');
                console.log('删除Modal内的分支:', branchId);
                deleteModalBranch(branchId);
            });
        }
        
        // 绑定跳转节点选择器变化事件
        const jumpSelect = container.querySelector(`select[data-branch-id="${branchNumber}"]`);
        if (jumpSelect) {
            jumpSelect.addEventListener('change', function(e) {
                const branchId = this.getAttribute('data-branch-id');
                const selectedNode = this.value;
                console.log(`分支-${branchId} 选择跳转到:`, selectedNode);
            });
        }
    }
    
    // 5.2 删除Modal内的分支
    function deleteModalBranch(branchId) {
        const container = document.getElementById('fallbackBranchesContainer');
        if (!container) return;
        
        const branchItem = container.querySelector(`.modal-branch-item[data-branch-id="${branchId}"]`);
        if (!branchItem) return;
        
        // 添加删除动画
        branchItem.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        branchItem.style.opacity = '0';
        branchItem.style.transform = 'translateX(-10px)';
        
        setTimeout(() => {
            branchItem.remove();
            
            // 检查是否还有分支，如果没有则恢复空状态
            const remainingBranches = container.querySelectorAll('.modal-branch-item');
            if (remainingBranches.length === 0) {
                loadModalConfig();
            }
        }, 300);
    }
    
    // 6. 保存配置
    function saveConfig() {
        // TODO: 实际保存逻辑
        console.log('保存共享兜底分支配置');
        
        // 模拟保存成功
        isConfigured = true;
        configuredBranches = [
            { name: '退款处理', type: 'intent' },
            { name: '物流查询', type: 'keyword' },
            { name: '投诉建议', type: 'intent' }
        ];
        
        // 更新状态卡片
        updateStatusCard();
        
        // 关闭 Modal
        closeModal();
        
        // 显示成功提示
        alert('配置已保存！');
    }
    
    // 调试：检查元素是否被找到
    console.log('=== 共享兜底分支元素检查 ===');
    console.log('fallbackSwitch:', fallbackSwitch);
    console.log('fallbackStatusCard:', fallbackStatusCard);
    console.log('configModal:', configModal);
    console.log('openConfigBtn:', openConfigBtn);
    console.log('editConfigBtn:', editConfigBtn);
    console.log('closeModalBtn:', closeModalBtn);
    console.log('cancelModalBtn:', cancelModalBtn);
    console.log('saveModalBtn:', saveModalBtn);
    console.log('modalOverlay:', modalOverlay);
    console.log('=========================');
    
    // 绑定事件
    if (openConfigBtn) {
        openConfigBtn.addEventListener('click', function(e) {
            e.preventDefault(); // 阻止默认行为（表单提交）
            e.stopPropagation(); // 阻止事件冒泡
            console.log('点击了立即配置按钮');
            openModal();
        });
        console.log('✓ 立即配置按钮事件已绑定');
    } else {
        console.warn('✗ 未找到立即配置按钮');
    }
    
    if (editConfigBtn) {
        editConfigBtn.addEventListener('click', function(e) {
            e.preventDefault(); // 阻止默认行为（表单提交）
            e.stopPropagation(); // 阻止事件冒泡
            console.log('点击了配置共享分支按钮');
            openModal();
        });
        console.log('✓ 配置共享分支按钮事件已绑定');
    } else {
        console.warn('✗ 未找到配置共享分支按钮');
    }
    
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            closeModal();
        });
        console.log('✓ 关闭按钮事件已绑定');
    }
    
    if (cancelModalBtn) {
        cancelModalBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            closeModal();
        });
        console.log('✓ 取消按钮事件已绑定');
    }
    
    if (saveModalBtn) {
        saveModalBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            saveConfig();
        });
        console.log('✓ 保存按钮事件已绑定');
    }
    
    if (modalOverlay) {
        modalOverlay.addEventListener('click', closeModal);
        console.log('✓ 遮罩层事件已绑定');
    }
    
    // ESC 键关闭 Modal
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && configModal && configModal.style.display === 'flex') {
            closeModal();
        }
    });
    
    console.log('共享兜底分支交互已初始化完成');
});

// ==================== 切换添加分支按钮样式 ====================
/**
 * 切换添加分支按钮的样式(空状态 <-> 普通样式)
 * @param {HTMLElement} container - 顾客消息识别容器
 * @param {boolean} isEmpty - 是否为空状态(true: 显示空状态样式, false: 显示普通样式)
 */
function toggleAddBranchStyle(container, isEmpty) {
    const addBranchSection = container.querySelector('.add-branch-section-empty, .add-branch-section');
    if (!addBranchSection) return;
    
    if (isEmpty) {
        // 切换为空状态样式
        addBranchSection.className = 'add-branch-section-empty';
        addBranchSection.innerHTML = `
            <div class="empty-state-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="none" viewBox="0 0 16 16">
                    <path stroke="currentColor" stroke-width="1" d="M5 13.5H2.5V11M5 5.5H8M8 5.5H11M8 5.5V11M2.5 5V2.5H5M11 13.5H13.5V11M13.5 5V2.5H11" />
                </svg>
            </div>
            <button class="add-branch-btn-empty">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 16 16">
                    <path stroke="currentColor" d="M3 8H13M8 3V13" />
                </svg>
                新增分支
            </button>
        `;
    } else {
        // 切换为普通样式
        addBranchSection.className = 'add-branch-section';
        addBranchSection.innerHTML = `
            <button class="add-branch-btn">
                <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="none" viewBox="0 0 16 16">
                    <path stroke="currentColor" d="M3 8H13M8 3V13" />
                </svg>
                新增分支
            </button>
        `;
    }
}

// ==================== 删除分支功能 ====================
document.addEventListener('click', function(e) {
    const deleteBranchBtn = e.target.closest('.branch-delete-btn');
    if (deleteBranchBtn) {
        e.preventDefault(); // 阻止表单提交
        console.log('点击了删除分支按钮');
        
        const branch = deleteBranchBtn.closest('.message-branch');
        if (!branch) return;
        
        const container = branch.closest('.message-recognition-container');
        const branchTitle = branch.querySelector('.branch-title')?.textContent || '此分支';
        
        // 确认删除
        if (confirm(`确定要删除「${branchTitle}」吗？删除后将无法恢复。`)) {
            console.log(`删除分支: ${branchTitle}`);
            
            // 添加删除动画
            branch.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
            branch.style.opacity = '0';
            branch.style.transform = 'translateX(-20px)';
            
            // 动画结束后移除元素
            setTimeout(() => {
                branch.remove();
                console.log(`${branchTitle} 已删除`);
                
                // 检查是否还有其他分支，如果没有则切换为空状态
                const remainingBranches = container.querySelectorAll('.message-branch');
                if (remainingBranches.length === 0) {
                    toggleAddBranchStyle(container, true);
                    console.log('所有分支已删除，切换为空状态样式');
                }
            }, 300);
        }
    }
});
