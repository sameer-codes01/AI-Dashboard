import clsx from "clsx";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> { }

export function Card({ className, ...props }: CardProps) {
    return (
        <div
            className={clsx(
                "rounded-xl border border-slate-200 bg-white shadow-sm ring-1 ring-slate-200/50 dark:bg-slate-900 dark:border-slate-800 dark:ring-slate-800",
                className
            )}
            {...props}
        />
    );
}
