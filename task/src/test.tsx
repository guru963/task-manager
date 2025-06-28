import { Button } from "@/components/ui/button"
import { toast } from "sonner"

export default function TestToast() {
  return <Button onClick={() => toast.success("Hello world!")}>Toast test</Button>
}