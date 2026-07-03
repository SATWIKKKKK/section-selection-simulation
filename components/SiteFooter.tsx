export default function SiteFooter() {
  return (
    <footer className="border-t border-gray-200 bg-white px-6 py-4 text-center text-xs text-gray-500">
      <p>
        This is a simulation tool. Not affiliated with or endorsed by KIIT University or SAP SE.
      </p>
      <p className="mt-1">All trademarks belong to their respective owners.</p>
      <p className="mt-2 flex items-center justify-center gap-1.5">
        Made by
        <a
          href="https://www.linkedin.com/in/satwikchandra45/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 font-semibold text-[#0a66c2] hover:underline"
        >
          <svg
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            width="13"
            height="13"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
          </svg>
          Satwik
        </a>
      </p>
    </footer>
  );
}
