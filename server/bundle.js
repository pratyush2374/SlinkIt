import esbuild from "esbuild";

esbuild
    .build({
        entryPoints: ["src/index.ts"],
        bundle: true,
        platform: "node",
        target: "es2020",
        format: "cjs", 
        outfile: "dist/server.js",
        external: [
            "@prisma/client",
            "bcrypt",
            "mock-aws-s3",
            "aws-sdk",
            "nock",
            "*.html",
        ],
        loader: { ".html": "text" },
    })
    .catch(() => process.exit(1));
