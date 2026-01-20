import { TerminalLine } from '@/components/flins-command'

export function GitSourceExamples() {
  const examples = [
    {
      comment:
        '# Directory name (Browse via `flins search` or https://flins.tech/)',
      command: 'flins add better-auth',
    },
    { comment: '# GitHub shorthand', command: 'flins add expo/skills' },
    {
      comment: '# GitHub full URL',
      command: 'flins add https://github.com/expo/skills',
    },
    { comment: '# GitLab', command: 'flins add https://gitlab.com/org/repo' },
    {
      comment: '# Codeberg',
      command: 'flins add https://codeberg.org/user/repo',
    },
    {
      comment: '# Any git repository',
      command: 'flins add https://example.com/repo.git',
    },
  ]

  return (
    <div className="space-y-2">
      {examples.map((example) => (
        <div key={example.command} className="space-y-0.5">
          <span className="text-xs text-muted-foreground">
            {example.comment}
          </span>
          <TerminalLine command={example.command} />
        </div>
      ))}
    </div>
  )
}
