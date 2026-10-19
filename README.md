# LUMINA SECURE

### Recruitment Website · Portfolio Project

A responsive Japanese recruitment website for **LUMINA SECURE**, a fictional cybersecurity company. Built with HTML, CSS, and vanilla JavaScript, with a focus on responsive layouts, typography, and subtle interactive details.

![LUMINA SECURE recruitment website hero image](assets/images/hero-image-1@2x.jpg)

## About the Project

This website was developed as a class project based on a recruitment website brief sourced from CrowdWorks. The company identity was replaced with the fictional name **LUMINA SECURE** for portfolio presentation.

This is an educational frontend implementation, rather than an official website or a commissioned project for LUMINA SECURE.

## Features

- **Responsive layout:** Mobile-first CSS with layouts for mobile, tablet, and desktop.
- **Animated ornaments:** Floating blocks with smooth, depth-based scroll parallax.
- **Culture carousel:** An infinite card slider with swipe, mouse drag, navigation buttons, pagination, and keyboard controls.
- **FAQ accordion:** Smooth expand/collapse transitions using native `details` and `summary` elements.
- **Button interactions:** Gradient fades, square particles, and arrow animations on hover and keyboard focus.
- **Motion preferences:** Reduced-motion support for users who prefer less animation.
- **Keyboard support:** Visible focus indicators and accessible labels for interactive controls.

## Built With

| Technology | Usage |
| --- | --- |
| HTML5 | Semantic page structure and Japanese content |
| CSS3 | Mobile-first layouts, custom properties, BEM naming, and animations |
| Vanilla JavaScript | Carousel, accordion transitions, parallax, and interaction states |
| Google Fonts | Noto Sans JP |

No framework, package installation, or build step is required.

## Page Sections

Hero · Our Message · Why Us · Mission · Jobs · Interview · Culture · Selection · FAQ · Join Our Team · Footer

## Run Locally

Clone the repository:

```bash
git clone https://github.com/ifa-pdn/lumina-secure.git
cd lumina-secure
```

Serve the project with your preferred static server, such as the VS Code Live Server extension. If Python 3 is installed, you can also run:

```bash
python3 -m http.server 8000 --bind 127.0.0.1
```

Then open [http://localhost:8000](http://localhost:8000) in your browser.

An internet connection is required to load Noto Sans JP from Google Fonts.

## Project Structure

```text
lumina-secure/
├── index.html
├── css/
│   └── style.css
├── js/
│   └── main.js
├── assets/
│   ├── images/
│   ├── icons/
│   ├── logo/
│   └── ornament/
├── .gitignore
└── README.md
```

## Demo Scope

The project implements the recruitment home page and its frontend interactions. Navigation and CTA links currently use `#` placeholders. The hamburger button is a visual placeholder; a menu panel, application form, backend, and destination pages are outside the scope of this demo.

## Project Context

- **Purpose:** Class assignment and portfolio presentation.
- **Brief source:** CrowdWorks.
- **Company identity:** Fictional branding created for this portfolio version.
- **Design and assets:** Based on the materials supplied for the class project; the fictional branding does not imply ownership of all source designs or assets.
