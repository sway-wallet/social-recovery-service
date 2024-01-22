import Link from "next/link"
import { JSX, SVGProps } from "react"

export default function Features() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl">Social Recovery Service Features</h1>
          <p className="max-w-[600px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
            We provide a secure and easy-to-use platform for your social recovery needs.
          </p>
        </div>
        <div className="mx-auto grid items-start gap-8 py-12 lg:max-w-5xl lg:grid-cols-3">
          <div className="grid gap-1">
            <ShieldIcon className="mx-auto h-12 w-12" />
            <h3 className="text-lg font-bold">Security</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              We prioritize your security with our advanced encryption methods.
            </p>
          </div>
          <div className="grid gap-1">
            <AccessibilityIcon className="mx-auto h-12 w-12" />
            <h3 className="text-lg font-bold">Ease of Use</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Our platform is designed to be user-friendly and intuitive.
            </p>
          </div>
          <div className="grid gap-1">
            <HelpCircleIcon className="mx-auto h-12 w-12" />
            <h3 className="text-lg font-bold">24/7 Support</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Our dedicated support team is available around the clock to assist you.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

function AccessibilityIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="16" cy="4" r="1" />
      <path d="m18 19 1-7-6 1" />
      <path d="m5 8 3-3 5.5 3-2.36 3.5" />
      <path d="M4.24 14.5a5 5 0 0 0 6.88 6" />
      <path d="M13.76 17.5a5 5 0 0 0-6.88-6" />
    </svg>
  )
}


function HelpCircleIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
      <path d="M12 17h.01" />
    </svg>
  )
}


function ShieldIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
    </svg>
  )
}
