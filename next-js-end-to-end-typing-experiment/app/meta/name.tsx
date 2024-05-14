export default function MetaName({ name }: { name: string }) {
    return (
        <>
            <meta property="og:site_name" content={name} />
            <meta name="application-name" content={name} />
        </>
    );
}
