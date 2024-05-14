export default function MetaColor({ color }: { color: string }) {
    return (
        <>
            <meta name="msapplication-TileColor" content={color} />
            <meta name="theme-color" content={color} />
        </>
    );
}
