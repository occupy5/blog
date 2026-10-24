export type Project = {
  name: string;
  url: string;
  category: 'projects' | 'hackathons';
  icon: string;
  iconAlt: string;
  kind?: string;
  tagline?: string;
  description?: string;
  linkLabel?: string;
  github?: string;
  articles?: { title: string; url: string; source: string }[];
  award?: { event: string; placement: string };
};

// Entries appear in this order within each category.
// Logo sources and related-brand substitutes are documented in public/projects/README.md.
export const projects: Project[] = [
  {
    name: 'Megi',
    url: 'https://megi.dev/zh',
    category: 'projects',
    icon: '/projects/megi.png',
    iconAlt: 'Megi Logo',
    kind: '浏览器扩展',
    tagline: '将 AI 对话，整理成思考的知识树。',
    description: '自动提取问题、拖拽分组，在长对话里找回思考的脉络。',
    linkLabel: '官网',
    articles: [
      {
        title: 'Megi — 将线性对话，生长为思考的知识树',
        url: 'https://sspai.com/post/104655',
        source: '少数派',
      },
      {
        title: 'Megi 背后',
        url: '/posts/megi_review',
        source: '开发小记',
      },
    ],
  },
  {
    name: 'Linepods',
    url: 'https://ai-passport.folotoy.cn/plays/621/',
    category: 'projects',
    icon: '/projects/linepods.svg',
    iconAlt: 'Linepods 石墨灰书页标识',
    kind: 'ESP32-C3',
    tagline: '把微信读书的划线，装进口袋。',
    description: '同步到 AI Passport，离线翻阅、随机遇见，重新遇见读过的文字。',
    linkLabel: '项目介绍',
    github: 'https://github.com/occupy5/linepods',
  },
  {
    name: 'Weeko Weekly',
    url: 'https://github.com/occupy5/weeko-weekly',
    category: 'hackathons',
    icon: '/projects/weeko-avatar.png',
    iconAlt: 'Weeko 考拉头像',
    description:
      '面向知识类视频创作者的 Agent 工作流，从资料研究，到幻灯片、口播与视频。',
    github: 'https://github.com/occupy5/weeko-weekly',
    award: { event: 'z.ai 黑客松', placement: '优秀奖' },
  },
  {
    name: 'Lens Brain',
    url: 'https://github.com/occupy5/lens_brain',
    category: 'hackathons',
    icon: '/projects/lens.png',
    iconAlt: 'Lens 官方组织标识，作为 Lens Brain 的生态替代',
    github: 'https://github.com/occupy5/lens_brain',
    award: { event: 'Lens 银杏黑客松', placement: '第四名' },
  },
];
