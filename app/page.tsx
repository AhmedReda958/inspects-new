"use client";

import { useState } from "react";

export default function Home() {
  const [isDark, setIsDark] = useState(false);

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle("dark");
  };

  const colors = [
    { name: "Primary Blue", value: "#021a60", description: "Main brand color" },
    {
      name: "Orange Accent",
      value: "#f25b06",
      description: "Secondary accent",
    },
    { name: "Deep Blue", value: "#032da6", description: "Darker blue variant" },
    { name: "Success Green", value: "#1fc16b", description: "Success states" },
    {
      name: "Light Background",
      value: "#fafbfd",
      description: "Subtle backgrounds",
    },
    { name: "Dark Text", value: "#333333", description: "Primary text" },
    { name: "Medium Gray", value: "#606060", description: "Muted text" },
    { name: "Light Gray", value: "#777777", description: "Secondary text" },
  ];

  return (
    <div className={isDark ? "dark" : ""}>
      <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
        {/* Header */}
        <header className="border-b border-border bg-card">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold text-primary">
                Inspects Design System
              </h1>
              <button
                onClick={toggleTheme}
                className="px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                {isDark ? "☀️ Light" : "🌙 Dark"}
              </button>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
          {/* Color Palette Section */}
          <section>
            <h2 className="text-3xl font-bold mb-6 text-foreground">
              Color Palette
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {colors.map((color) => (
                <div
                  key={color.name}
                  className="bg-card border border-border rounded-lg p-4 shadow-sm"
                >
                  <div
                    className="w-full h-16 rounded-md mb-3 border border-border"
                    style={{ backgroundColor: color.value }}
                  />
                  <h3 className="font-semibold text-card-foreground">
                    {color.name}
                  </h3>
                  <p className="text-sm text-muted-foreground font-mono">
                    {color.value}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {color.description}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Components Section */}
          <section>
            <h2 className="text-3xl font-bold mb-6 text-foreground">
              Component Examples
            </h2>

            {/* Buttons */}
            <div className="space-y-8">
              <div>
                <h3 className="text-xl font-semibold mb-4 text-foreground">
                  Buttons
                </h3>
                <div className="flex flex-wrap gap-4">
                  <button className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
                    Primary Button
                  </button>
                  <button className="px-6 py-2 bg-accent text-accent-foreground rounded-lg hover:bg-accent/90 transition-colors">
                    Accent Button
                  </button>
                  <button className="px-6 py-2 bg-secondary text-secondary-foreground border border-border rounded-lg hover:bg-secondary/80 transition-colors">
                    Secondary Button
                  </button>
                  <button className="px-6 py-2 border border-border text-foreground rounded-lg hover:bg-muted transition-colors">
                    Outline Button
                  </button>
                </div>
              </div>

              {/* Cards */}
              <div>
                <h3 className="text-xl font-semibold mb-4 text-foreground">
                  Cards
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
                    <h4 className="text-lg font-semibold mb-2 text-card-foreground">
                      Default Card
                    </h4>
                    <p className="text-muted-foreground">
                      This is a default card using the new color system.
                    </p>
                    <button className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm hover:bg-primary/90 transition-colors">
                      Learn More
                    </button>
                  </div>

                  <div className="bg-primary text-primary-foreground rounded-lg p-6 shadow-sm">
                    <h4 className="text-lg font-semibold mb-2">Primary Card</h4>
                    <p className="text-primary-foreground/80">
                      This card uses the primary color as background.
                    </p>
                    <button className="mt-4 px-4 py-2 bg-accent text-accent-foreground rounded-md text-sm hover:bg-accent/90 transition-colors">
                      Get Started
                    </button>
                  </div>

                  <div className="bg-accent text-accent-foreground rounded-lg p-6 shadow-sm">
                    <h4 className="text-lg font-semibold mb-2">Accent Card</h4>
                    <p className="text-accent-foreground/80">
                      This card uses the accent color for highlights.
                    </p>
                    <button className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm hover:bg-primary/90 transition-colors">
                      Contact Us
                    </button>
                  </div>
                </div>
              </div>

              {/* Form Elements */}
              <div>
                <h3 className="text-xl font-semibold mb-4 text-foreground">
                  Form Elements
                </h3>
                <div className="max-w-md space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      placeholder="Enter your email"
                      className="w-full px-3 py-2 bg-input border border-border rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Message
                    </label>
                    <textarea
                      placeholder="Enter your message"
                      rows={3}
                      className="w-full px-3 py-2 bg-input border border-border rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                    />
                  </div>
                  <button className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors">
                    Submit Form
                  </button>
                </div>
              </div>

              {/* Status Elements */}
              <div>
                <h3 className="text-xl font-semibold mb-4 text-foreground">
                  Status Elements
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                    <div className="w-2 h-2 bg-chart-2 rounded-full"></div>
                    <span className="text-green-800 dark:text-green-200">
                      Success: Operation completed successfully
                    </span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg">
                    <div className="w-2 h-2 bg-accent rounded-full"></div>
                    <span className="text-orange-800 dark:text-orange-200">
                      Warning: Please review your settings
                    </span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                    <div className="w-2 h-2 bg-destructive rounded-full"></div>
                    <span className="text-red-800 dark:text-red-200">
                      Error: Something went wrong
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Typography Section */}
          <section>
            <h2 className="text-h2 font-bold mb-6 text-foreground">
              Typography System
            </h2>
            <div className="space-y-8">
              {/* Headings */}
              <div>
                <h3 className="text-h3 font-bold mb-4 text-foreground">
                  Headings
                </h3>
                <div className="space-y-4">
                  <div className="border border-border rounded-lg p-4">
                    <h1 className="mb-2">Heading 1 - Main Title</h1>
                    <small className="text-muted-foreground">
                      Font: Inter Bold, text-4xl/leading-tight (HTML h1)
                    </small>
                  </div>

                  <div className="border border-border rounded-lg p-4">
                    <h2 className="mb-2">Heading 2 - Section Title</h2>
                    <small className="text-muted-foreground">
                      Font: Inter Bold, text-3xl/leading-tight (HTML h2)
                    </small>
                  </div>

                  <div className="border border-border rounded-lg p-4">
                    <h3 className="mb-2">Heading 3 - Subsection</h3>
                    <small className="text-muted-foreground">
                      Font: Inter Bold, text-2xl/leading-tight (HTML h3)
                    </small>
                  </div>

                  <div className="border border-border rounded-lg p-4">
                    <h4 className="mb-2">Heading 4 - Component Title</h4>
                    <small className="text-muted-foreground">
                      Font: Inter Bold, text-xl/leading-tight (HTML h4)
                    </small>
                  </div>

                  <div className="border border-border rounded-lg p-4">
                    <h5 className="mb-2">Heading 5 - Small Heading</h5>
                    <small className="text-muted-foreground">
                      Font: Inter Medium, text-lg/leading-tight (HTML h5)
                    </small>
                  </div>
                </div>
              </div>

              {/* Body Text */}
              <div>
                <h3 className="mb-4">Body Text</h3>
                <div className="space-y-4">
                  <div className="border border-border rounded-lg p-4">
                    <p className="mb-2">
                      Body 1 - This is the primary body text used for main
                      content. It should be easily readable and provide good
                      contrast against the background.
                    </p>
                    <small className="text-muted-foreground">
                      Font: Inter Normal, text-base/leading-relaxed (HTML p)
                    </small>
                  </div>

                  <div className="border border-border rounded-lg p-4">
                    <small className="block mb-2 text-foreground">
                      Small - This is smaller text, often used for descriptions
                      and supporting content.
                    </small>
                    <small className="text-muted-foreground">
                      Font: Inter Normal, text-sm/leading-normal (HTML small)
                    </small>
                  </div>

                  <div className="border border-border rounded-lg p-4">
                    <p className="text-body-3 text-foreground mb-2">
                      Body 3 - Small text for captions, labels, and metadata.
                    </p>
                    <p className="text-body-3 text-muted-foreground">
                      Font: Inter Regular, Dynamic: 0.75rem/1.125rem
                      (text-body-3)
                    </p>
                  </div>

                  <div className="border border-border rounded-lg p-4">
                    <p className="text-body-4 text-foreground mb-2">
                      Body 4 - Very small text for fine print and disclaimers.
                    </p>
                    <p className="text-body-3 text-muted-foreground">
                      Font: Inter Regular, Dynamic: 0.625rem/0.9375rem
                      (text-body-4)
                    </p>
                  </div>

                  <div className="border border-border rounded-lg p-4">
                    <p className="text-body-5 text-foreground mb-2">
                      Body 5 - Micro text for extremely compact layouts.
                    </p>
                    <p className="text-body-3 text-muted-foreground">
                      Font: Inter Regular, Dynamic: 0.5rem/0.75rem (text-body-5)
                    </p>
                  </div>

                  <div className="border border-border rounded-lg p-4">
                    <p className="text-body-6 text-foreground mb-2">
                      Body 6 - Ultra-small text for minimal interfaces.
                    </p>
                    <p className="text-body-3 text-muted-foreground">
                      Font: Inter Regular, Dynamic: 0.375rem/0.5625rem
                      (text-body-6)
                    </p>
                  </div>
                </div>
              </div>

              {/* Available Classes */}
              <div>
                <h3 className="mb-4">HTML Tag Typography System</h3>
                <div className="bg-muted/50 border border-border rounded-lg p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="mb-3">Styled HTML Tags</h4>
                      <div className="space-y-2">
                        <code className="block text-sm font-mono text-accent">
                          h1, h2, h3, h4, h5, h6
                        </code>
                        <code className="block text-sm font-mono text-accent">
                          p, small, ul, ol
                        </code>
                        <code className="block text-sm font-mono text-accent">
                          code, pre
                        </code>
                      </div>
                    </div>
                    <div>
                      <h4 className="mb-3">Tailwind Classes Used</h4>
                      <div className="space-y-2">
                        <code className="block text-sm font-mono text-accent">
                          text-4xl, text-3xl, text-2xl, text-xl, text-lg
                        </code>
                        <code className="block text-sm font-mono text-accent">
                          leading-tight, leading-relaxed, leading-normal
                        </code>
                        <code className="block text-sm font-mono text-accent">
                          font-bold, font-medium, font-normal
                        </code>
                      </div>
                    </div>
                  </div>
                  <div className="mt-6 space-y-4">
                    <div className="p-4 bg-background rounded-lg border border-border">
                      <h4 className="mb-2">CSS Implementation:</h4>
                      <code className="text-sm font-mono text-muted-foreground block">
                        h1 &#123;
                        <br />
                        &nbsp;&nbsp;@apply text-4xl leading-tight font-bold
                        text-foreground;
                        <br />
                        &#125;
                      </code>
                    </div>

                    <div className="p-4 bg-background rounded-lg border border-border">
                      <h4 className="mb-2">Usage Examples:</h4>
                      <code className="text-sm font-mono text-muted-foreground">
                        &lt;h1&gt;Automatic styling applied&lt;/h1&gt;
                        <br />
                        &lt;p&gt;Paragraph with default styling&lt;/p&gt;
                        <br />
                        &lt;small&gt;Small text with muted color&lt;/small&gt;
                      </code>
                    </div>
                  </div>
                </div>
              </div>

              {/* Color Variations */}
              <div>
                <h3 className="text-h3 font-bold mb-4 text-foreground">
                  Text Colors
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="border border-border rounded-lg p-4">
                    <p className="text-body-1 text-foreground mb-1">
                      Primary Text
                    </p>
                    <p className="text-body-3 text-muted-foreground">
                      Used for main content
                    </p>
                  </div>
                  <div className="border border-border rounded-lg p-4">
                    <p className="text-body-1 text-muted-foreground mb-1">
                      Muted Text
                    </p>
                    <p className="text-body-3 text-muted-foreground">
                      Used for secondary content
                    </p>
                  </div>
                  <div className="border border-border rounded-lg p-4">
                    <p className="text-body-1 text-primary mb-1">
                      Primary Color
                    </p>
                    <p className="text-body-3 text-muted-foreground">
                      Used for emphasis
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>

        {/* Footer */}
        <footer className="border-t border-border bg-card mt-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <p className="text-center text-muted-foreground">
              Design System Showcase - Updated with Figma Colors
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}
