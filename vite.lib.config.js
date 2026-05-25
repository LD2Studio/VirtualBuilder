import { resolve } from 'node:path'

export default {
    build: {
        lib: {
            entry: resolve(__dirname, 'lib/index.js'),
            name: 'VirtualBuilder',
            formats: ["es"],
            fileName: () => 'index.js',
        },
        rollupOptions: {
            // Mark three.js and all its submodules as external (peer dependency)
            external: [
                'three',
                /^three\/.*/,
                'tweakpane',
            ]
        }
    }
}