import svgr from "esbuild-plugin-svgr"

export default {
  plugins: [
    svgr({
      exportType: "named",
      svgrOptions: {
        icon: true,
        svgoConfig: {
          plugins: [
            {
              name: "preset-default",
              params: {
                overrides: {
                  removeViewBox: false,
                },
              },
            },
          ],
        },
      },
    }),
  ],
}
