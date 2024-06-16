const types = ['feat', 'fix', 'docs', 'style', 'refactor', 'perf', 'test', 'build', 'release', 'chore', 'revert'];
// feat: 一项新功能
// fix: 一个错误修复
// docs: 仅文档更改
// style: 不影响代码含义的更改（空白，格式，缺少分号等）
// refactor: 既不修正错误也不增加功能的代码更改（重构）
// perf: 改进性能的代码更改
// test: 添加缺失或更正现有测试
// build: 影响构建系统或外部依赖项的更改（gulp，npm 等）
// ci: 对 CI 配置文件和脚本的更改
// release：发布
// chore: 更改构建过程或辅助工具和库，例如文档生成
// revert: 回滚到上一个版本
module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-empty': [2, 'never'],
    'type-enum': [2, 'always', types],
    'scope-case': [0, 'always'],
    'subject-empty': [2, 'never'],
    'subject-case': [0, 'never'],
    'header-max-length': [2, 'always', 88],
  },
};