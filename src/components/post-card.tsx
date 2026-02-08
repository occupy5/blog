import Link from 'next/link';

export const PostCard = ({
  title,
  description,
  url,
  date,
}: {
  title: string;
  description: string;
  url: string;
  date: string;
}) => {
  return (
    <Link href={url} className="group block w-full h-full">
      <article className="
        flex flex-col justify-between h-full p-6
        rounded-2xl border border-fd-border
        bg-fd-card text-fd-card-foreground
        transition-all duration-300 ease-out
        hover:shadow-lg hover:-translate-y-1
      ">
        <div>
          <div className="mb-4 flex items-center justify-between">
            <time className="text-xs font-medium tracking-wider text-fd-muted-foreground uppercase opacity-70">
              {date}
            </time>
          </div>

          <h2 className="mb-3 text-2xl font-bold leading-tight tracking-tight group-hover:text-fd-primary transition-colors">
            {title}
          </h2>

          <p className="text-sm text-fd-muted-foreground leading-relaxed line-clamp-3">
            {description}
          </p>
        </div>

        <div className="mt-6 flex items-center text-sm font-medium text-fd-primary opacity-0 -translate-x-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0">
          <span>阅读全文</span>
          <svg 
            className="ml-2 h-4 w-4" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor" 
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </div>
      </article>
    </Link>
  );
};