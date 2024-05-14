export default function MetaDescription({
    description,
}: {
    description: string;
}) {
    return (
        <>
            <meta
                key="og-description"
                property="og:description"
                content={description}
            />
            <meta
                key="twitter-description"
                name="twitter:description"
                content={description}
            />
            <meta name="twitter:image:alt" content={description} />
            <meta key="description" name="description" content={description} />
        </>
    );
}
