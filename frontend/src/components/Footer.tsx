export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      className={
        'flex justify-center items-center w-full p-5 h-10 bg-gray-800 text-white border-t-2 border-sky-800'
      }
    >
      <span>&#169; {currentYear}</span>
      <span className={'px-2'}>-</span>
      <span>{import.meta.env.VITE_APP_TITLE}</span>
    </footer>
  );
}
