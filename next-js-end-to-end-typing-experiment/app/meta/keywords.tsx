export default function MetaKeywords({ keywords }: { keywords: string[] }) {
    return (
        <>
            <meta name="keywords" content={keywords.join(",")} />
        </>
    );
}
