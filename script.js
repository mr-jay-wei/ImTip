document.addEventListener('DOMContentLoaded', function() {
  // 获取DOM元素
  const inputArea = document.getElementById('input-area');
  const imeIndicator = document.getElementById('ime-indicator');
  const langIcon = document.getElementById('lang-icon');
  const langText = document.getElementById('lang-text');
  const widthText = document.getElementById('width-text');
  const toggleLanguageBtn = document.getElementById('toggle-language');
  const toggleWidthBtn = document.getElementById('toggle-width');
  
  // 输入法状态
  let imeState = {
    language: 'Chinese', // Chinese 或 English
    width: 'Half-width',  // Half-width 或 Full-width
    hideTimeout: null
  };

  // 更新输入法状态提示内容
  function updateIndicatorContent() {
    // 更新图标
    langIcon.className = `ime-icon ${imeState.language === 'English' ? 'icon-en' : 'icon-cn'}`;
    
    // 更新文字
    const langDisplay = imeState.language === 'English' ? '英文' : '中文';
    const widthDisplay = imeState.width === 'Half-width' ? '半角' : '全角';
    
    langText.textContent = langDisplay;
    widthText.textContent = widthDisplay;
    
    // 更新语言文本颜色
    if (imeState.language === 'English') {
      langText.className = 'text-xs font-medium text-gray-900';
    } else {
      langText.className = 'text-xs font-medium text-red-600';
    }
    
    // 更新切换语言按钮
    toggleLanguageBtn.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-languages"><path d="m5 8 6 6"></path><path d="m4 14 6-6 2-3"></path><path d="M2 5h12"></path><path d="M7 2h1"></path><path d="m22 22-5-10-5 10"></path><path d="M14 18h6"></path></svg>
      切换语言 (当前: ${langDisplay})
    `;
    toggleLanguageBtn.className = imeState.language === 'English' 
      ? 'px-4 py-2 bg-gray-900 text-white rounded hover:bg-gray-800 transition-colors flex items-center gap-2'
      : 'px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors flex items-center gap-2';
    
    // 更新切换宽度按钮
    toggleWidthBtn.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-type"><polyline points="4 7 4 4 20 4 20 7"></polyline><line x1="9" x2="15" y1="20" y2="20"></line><line x1="12" x2="12" y1="4" y2="20"></line></svg>
      切换全/半角 (当前: ${widthDisplay})
    `;
    toggleWidthBtn.className = imeState.width === 'Half-width'
      ? 'px-4 py-2 bg-gray-100 text-gray-800 rounded hover:bg-gray-200 transition-colors flex items-center gap-2'
      : 'px-4 py-2 bg-indigo-100 text-indigo-800 rounded hover:bg-indigo-200 transition-colors flex items-center gap-2';
  }

  // 显示输入法状态提示
  function showImeIndicator() {
    // 获取光标位置
    const textareaRect = inputArea.getBoundingClientRect();
    const selectionEnd = inputArea.selectionEnd;
    
    // 计算光标在textarea中的位置
    const text = inputArea.value.substring(0, selectionEnd);
    const lines = text.split('\n');
    const currentLine = lines.length;
    const currentLineText = lines[currentLine - 1] || '';
    
    // 估算每个字符的宽度和每行的高度
    const charWidth = 8; // 像素
    const lineHeight = 19; // 像素
    
    // 计算光标在textarea中的坐标
    const cursorX = textareaRect.left + (currentLineText.length * charWidth) + inputArea.offsetLeft + 8;
    const cursorY = textareaRect.top + ((currentLine - 1) * lineHeight) + inputArea.offsetTop + 8;
    
    // 设置提示框位置 (在光标左上方)
    imeIndicator.style.left = `${cursorX - 20}px`;
    imeIndicator.style.top = `${cursorY - 40}px`;
    
    // 更新提示内容
    updateIndicatorContent();
    
    // 显示提示框并添加动画
    imeIndicator.classList.remove('hidden');
    imeIndicator.classList.remove('animate-fadeInOut');
    void imeIndicator.offsetWidth; // 重置动画
    imeIndicator.classList.add('animate-fadeInOut');
    
    // 自动隐藏提示框
    clearTimeout(imeState.hideTimeout);
    imeState.hideTimeout = setTimeout(() => {
      imeIndicator.classList.add('hidden');
    }, 3000);
  }

  // 事件监听
  inputArea.addEventListener('input', showImeIndicator);
  inputArea.addEventListener('click', function() {
    if (inputArea.value.length > 0) {
      showImeIndicator();
    }
  });

  // 切换语言按钮
  toggleLanguageBtn.addEventListener('click', function() {
    imeState.language = imeState.language === 'English' ? 'Chinese' : 'English';
    updateIndicatorContent();
    
    if (inputArea.value.length > 0) {
      showImeIndicator();
    }
    
    // 聚焦到输入区域
    inputArea.focus();
  });

  // 切换字符宽度按钮
  toggleWidthBtn.addEventListener('click', function() {
    imeState.width = imeState.width === 'Half-width' ? 'Full-width' : 'Half-width';
    updateIndicatorContent();
    
    if (inputArea.value.length > 0) {
      showImeIndicator();
    }
    
    // 聚焦到输入区域
    inputArea.focus();
  });

  // 页面加载时聚焦到输入区域
  inputArea.focus();
  
  // 初始化按钮状态
  updateIndicatorContent();
});
