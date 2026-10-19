import { redirect } from "next/navigation";

// The shelf lives on the homepage; /courses sends people there.
export default function CoursesIndex() {
  redirect("/#courses");
}
