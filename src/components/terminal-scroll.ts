export function scrollTerminalToBottom(
  element: Pick<HTMLElement, "scrollTop" | "scrollHeight"> | null
) {
  if (element) element.scrollTop = element.scrollHeight;
}
