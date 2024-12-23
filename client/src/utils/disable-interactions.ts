export const disableInteractions = (disable: boolean) => {
  if (disable) {
    document.body.classList.remove("pointer-events-auto");
    document.body.classList.add("pointer-events-none");
  } else {
    document.body.classList.remove("pointer-events-none");
    document.body.classList.add("pointer-events-auto");
  }
};
