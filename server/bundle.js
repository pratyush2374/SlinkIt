// import esbuild from "esbuild";

// esbuild
//     .build({
//         entryPoints: ["src/index.ts"], // Entry point for your server
//         bundle: true, // Bundle all dependencies
//         platform: "node", // Target Node.js environment
//         target: "es2020", // Match your tsconfig target
//         outfile: "dist/server.js", // Output bundled file
//         external: [
//             "@prisma/client", // Prisma client
//             "mock-aws-s3", // Mark unresolved dependencies as external
//             "aws-sdk",
//             "nock",
//             "*.html", // Ignore .html files
//         ],
//         loader: {
//             // Handle specific file types
//             ".html": "text",
//         },
//     })
//     .catch(() => process.exit(1));

import esbuild from "esbuild";

esbuild
    .build({
        entryPoints: ["src/index.ts"],
        bundle: true,
        platform: "node",
        target: "es2020",
        format: "cjs", // Output CommonJS format
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
