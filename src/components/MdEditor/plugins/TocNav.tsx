import React from 'react';
import { PluginComponent } from 'react-markdown-editor-lite';
import style from './style.less';

export default class TocNav extends PluginComponent {
  // 这里定义插件名称，注意不能重复
  static pluginName = 'toc-nav';
  // 定义按钮被防止在哪个位置，默认为左侧，还可以放置在右侧（right）
  static align = 'right';
  // 如果需要的话，可以在这里定义默认选项
  static defaultConfig = {
    start: 0,
  };

  state = {
    existOutlineDom: false,
    open: false,
  };
  insertOutlineDom = () => {
    const containerEl = this.editor.getMdElement()?.parentNode?.parentNode;
    this.outlineEl = document.createElement('section');

    this.outlineEl.setAttribute('class', `${style.outline} section`);
    this.outlineEl.setAttribute('id', 'rc-markdown-outline');
    containerEl?.appendChild(this.outlineEl);
  };
  handleClick = () => {
    this.editor.insertText('love');
    const { existOutlineDom, open } = this.state;
    const isVisible = !open;
    if (existOutlineDom) {
      if (isVisible) {
        this.outlineEl?.classList.remove('in-visible');
      } else {
        this.outlineEl.classList.add('in-visible');
      }
    } else {
      this.insertOutlineDom();
      this.setState({
        existOutlineDom: true,
      });
    }
    this.setState({
      open: isVisible,
    });
  };

  render() {
    return (
      <span className="button " title="大纲" onClick={this.handleClick}>
        大纲
      </span>
    );
  }
}
