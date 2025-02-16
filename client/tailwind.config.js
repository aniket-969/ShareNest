/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
  	extend: {
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
  		colors: {
  			background: '#040404',
  			foreground: '#ffffff',
  			card: {
  				DEFAULT: '#de8c9d',
  				foreground: '#fe2858'
  			},
  			popover: {
  				DEFAULT: '#040404',
  				foreground: '#de8c9d'
  			},
  			primary: {
  				DEFAULT: '#fe2858',
  				foreground: '#ffffff'
  			},
  			secondary: {
  				DEFAULT: '#2af0ea',
  				foreground: '#040404'
  			},
  			muted: {
  				DEFAULT: '#397684',
  				foreground: '#de8c9d'
  			},
  			accent: {
  				DEFAULT: '#2af0ea',
  				foreground: '#040404'
  			},
  			destructive: {
  				DEFAULT: '#fe2858',
  				foreground: '#040404'
  			},
  			border: '#040404',
  			input: '#fe2858',
  			ring: '#fe2858',
  			chart: {
  				'1': '#fe2858',
  				'2': '#2af0ea',
  				'3': '#397684',
  				'4': '#fe2858',
  				'5': '#040404'
  			},
  			sidebar: {
  				DEFAULT: 'hsl(var(--sidebar-background))',
  				foreground: 'hsl(var(--sidebar-foreground))',
  				primary: 'hsl(var(--sidebar-primary))',
  				'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
  				accent: 'hsl(var(--sidebar-accent))',
  				'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
  				border: 'hsl(var(--sidebar-border))',
  				ring: 'hsl(var(--sidebar-ring))'
  			}
  		}
  	}
  },
  plugins: [require("tailwindcss-animate")],
};
