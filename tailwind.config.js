const theme = require("./config/theme.json");

let font_base = Number(theme.fonts.font_size.base.replace("px", ""));
let font_scale = Number(theme.fonts.font_size.scale);
let h6 = font_base / font_base;
let h5 = h6 * font_scale;
let h4 = h5 * font_scale;
let h3 = h4 * font_scale;
let h2 = h3 * font_scale;
let h1 = h2 * font_scale;
// fontPrimary and fontPrimaryType are no longer needed here as we'll use CSS variables
let fontSecondary, fontSecondaryType;
// Removed fontPrimary and fontPrimaryType generation
if (theme.fonts.font_family.secondary) {
  fontSecondary = theme.fonts.font_family.secondary
    .replace(/\+/g, " ")
    .replace(/:[ital,]*[ital@]*[wght@]*[0-9,;]+/gi, "");
  fontSecondaryType = theme.fonts.font_family.secondary_type;
}

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class", "class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./layouts/**/*.{js,ts,jsx,tsx}",
"./layouts/shortcodes/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./content/**/*.{md,mdx}",
  ],
  theme: {
  	screens: {
  		sm: '540px',
  		md: '768px',
  		lg: '992px',
  		xl: '1280px',
  		'2xl': '1536px'
  	},
  	container: {
  		center: true,
  		padding: '2rem'
  	},
  	extend: {
  		colors: {
  			text: 'theme.colors.default.text_color.default',
  			dark: 'theme.colors.default.text_color.dark',
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			body: 'theme.colors.default.theme_color.body',
  			border: 'hsl(var(--border))',
  			light: 'theme.colors.default.text_color.light',
  			'theme-light': 'theme.colors.default.theme_color.theme_light',
  			'theme-dark': 'theme.colors.default.theme_color.theme_dark',
  			darkmode: {
  				text: 'theme.colors.darkmode.text_color.default',
  				light: 'theme.colors.darkmode.text_color.light',
  				dark: 'theme.colors.darkmode.text_color.dark',
  				primary: 'theme.colors.darkmode.theme_color.primary',
  				secondary: 'theme.colors.darkmode.theme_color.secondary',
  				body: 'theme.colors.darkmode.theme_color.body',
  				border: 'theme.colors.darkmode.theme_color.border',
  				'theme-light': 'theme.colors.darkmode.theme_color.theme_light',
  				'theme-dark': 'theme.colors.darkmode.theme_color.theme_dark'
  			},
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			}
  		},
  		fontSize: {
  			base: font_base + "px", // Corrected string concatenation
  			h1: h1 + "rem", // Corrected string concatenation
  			'h1-sm': (h1 * 0.8) + "rem", // Corrected string concatenation
  			h2: h2 + "rem", // Corrected string concatenation
  			'h2-sm': (h2 * 0.8) + "rem", // Corrected string concatenation
  			h3: h3 + "rem", // Corrected string concatenation
  			'h3-sm': (h3 * 0.8) + "rem", // Corrected string concatenation
  			h4: h4 + "rem", // Corrected string concatenation
  			h5: h5 + "rem", // Corrected string concatenation
  			h6: h6 + "rem" // Corrected string concatenation
  		},
  		fontFamily: {
  		    sans: ['var(--font-sans)', ...theme.fonts.font_family.primary_type === 'sans-serif' ? ['sans-serif'] : []], // Use CSS variable for sans
  			// primary: [ // Keeping this commented out, as 'sans' should be the default
  			// 	'fontPrimary',
  			// 	'fontPrimaryType'
  			// ],
  			secondary: [
  				fontSecondary, // Use the generated fontSecondary
  				fontSecondaryType
  			]
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		}
  	}
  },
  plugins: [
    require("@tailwindcss/typography"),
    require("tailwind-scrollbar"),
    require("@tailwindcss/forms"),
    require("tailwind-bootstrap-grid")({ generateContainer: false }),
      require("tailwindcss-animate")
],
};
