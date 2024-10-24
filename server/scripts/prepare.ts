import Bun from "bun"
import pc from "picocolors"

async function runPrepare() {
  console.log(pc.blue("Preparing public.generated.ts..."))
  await Bun.write(
    "src/public.generated.ts",
    `
export interface PathData {
  mimeType: string;
  data: string;
}

export const paths: Record<string, PathData> = {}
`,
  )
  console.log(pc.green("public.generated.ts prepared successfully."))
}

runPrepare()
