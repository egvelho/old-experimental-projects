export default function MetaImage({ image }: { image: string }) {
    return (
        <>
            <meta name="twitter:image" content={image} />
            <meta property="og:image" content={image} />
        </>
    );
}
