import { revalidatePath } from "next/cache";

export function revalidateApp() {
  revalidatePath("/");
  revalidatePath("/calendar");
  revalidatePath("/work");
  revalidatePath("/payment");
}
