import Link from 'next/link';
import Image from 'next/image';
import lang from "@/locales";
import React from "react";

// 产品卡片组件
function ProductCard({ product }) {
    // 提取第一张图片
    const cover = product.cover ? product.cover.split('#')[0] : '';
    return (
        <div className="group">
            <div className="relative mb-4 overflow-hidden bg-gray-100" style={{ paddingBottom: '100%' }}>
                <Link href={`/product/${product.id}`}>
                    <div className="absolute w-full h-full top-0 left-0 transition-transform duration-700 group-hover:scale-110">
                        <Image
                            src={`${process.env.NEXT_PUBLIC_BASE_URL}/upload/img/${cover}`}
                            alt={product.title}
                            fill
                            quality={90}
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                        />
                    </div>
                </Link>
            </div>

            <h3 className="text-base md:text-lg font-medium text-center">
                <Link href={`/product/${product.id}`} className="hover:text-mainColorNormal transition-colors">
                    {product.title}
                </Link>
            </h3>
        </div>
    );
}

export default function FeaturedProducts({featuredData}) {
    return (
        <div className="py-12 sm:py-16 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h2 className="text-2xl md:text-4xl font-bold text-gray-900 mb-5 uppercase">{lang.PopularProducts}</h2>
                    <div className="w-[60px] h-[2px] bg-mainColorNormal mx-auto"></div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-4 lg:gap-x-6 gap-y-5 lg:gap-y-10">
                    {featuredData.map((product) => (
                        <ProductCard key={product.id} product={product}/>
                    ))}
                </div>

                <div className="text-center mt-12">
                    <Link
                        href="/product"
                        className="inline-flex items-center rounded-full px-6 py-3 bg-mainColorNormal text-white font-medium hover:bg-mainColorDeep transition-colors duration-300"
                    >
                        {lang.AllProducts}
                        <svg className="ml-2 w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"
                             fill="currentColor">
                            <path fillRule="evenodd"
                                  d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
                                  clipRule="evenodd"/>
                        </svg>
                    </Link>
                </div>
            </div>
            <section className="py-24 bg-background">
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        <div
                            className="group bg-card rounded-2xl shadow-card hover:shadow-elevated transition-all duration-300 overflow-hidden animate-fade-in-up"
                            style="animation-delay: 0s;">
                            <div className="relative h-64 overflow-hidden bg-gradient-subtle"><img
                                src="/assets/urchip-uhf-BULchiaI.jpg" alt="URChip UHF"
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"/>
                                <div className="absolute inset-0 bg-gradient-to-t from-primary/60 to-transparent"></div>
                            </div>
                            <div className="p-8">
                                <div
                                    className="inline-block px-3 py-1 bg-accent/10 text-accent text-sm font-medium rounded-full mb-4">Long-Range
                                    RFID Chip
                                </div>
                                <h3 className="text-3xl font-bold text-foreground mb-4 group-hover:text-accent transition-colors">URChip
                                    UHF</h3><p className="text-muted-foreground mb-6 leading-relaxed">Industry-leading
                                read range up to 10 meters. Perfect for high-volume automated sorting and counting.</p>
                                <div className="space-y-2 mb-6">
                                    <div className="flex items-center gap-2">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18"
                                             viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                                             stroke-linecap="round" stroke-linejoin="round"
                                             className="lucide lucide-check text-accent flex-shrink-0">
                                            <path d="M20 6 9 17l-5-5"></path>
                                        </svg>
                                        <span className="text-sm text-foreground">10m+ read range</span></div>
                                    <div className="flex items-center gap-2">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18"
                                             viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                                             stroke-linecap="round" stroke-linejoin="round"
                                             className="lucide lucide-check text-accent flex-shrink-0">
                                            <path d="M20 6 9 17l-5-5"></path>
                                        </svg>
                                        <span className="text-sm text-foreground">200+ wash cycles</span></div>
                                    <div className="flex items-center gap-2">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18"
                                             viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                                             stroke-linecap="round" stroke-linejoin="round"
                                             className="lucide lucide-check text-accent flex-shrink-0">
                                            <path d="M20 6 9 17l-5-5"></path>
                                        </svg>
                                        <span className="text-sm text-foreground">EPC Gen2 compliant</span></div>
                                    <div className="flex items-center gap-2">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18"
                                             viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                                             stroke-linecap="round" stroke-linejoin="round"
                                             className="lucide lucide-check text-accent flex-shrink-0">
                                            <path d="M20 6 9 17l-5-5"></path>
                                        </svg>
                                        <span className="text-sm text-foreground">Ultra-thin profile</span></div>
                                </div>
                                <div className="border-t border-border pt-6 mb-6"><h4
                                    className="font-semibold text-foreground mb-3">Technical Specs</h4>
                                    <ul className="space-y-1">
                                        <li className="text-sm text-muted-foreground">Frequency: 860-960 MHz</li>
                                        <li className="text-sm text-muted-foreground">Memory: 96-bit EPC</li>
                                        <li className="text-sm text-muted-foreground">Size: 8mm x 8mm</li>
                                    </ul>
                                </div>
                                <div className="flex gap-3"><a
                                    className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&amp;_svg]:pointer-events-none [&amp;_svg]:size-4 [&amp;_svg]:shrink-0 bg-accent text-accent-foreground hover:bg-turquoise-light shadow-glow hover:shadow-elevated transition-smooth font-semibold h-10 px-4 py-2 flex-1"
                                    href="/contact">Get Quote</a>
                                    <button
                                        className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&amp;_svg]:pointer-events-none [&amp;_svg]:size-4 [&amp;_svg]:shrink-0 border-2 border-input bg-background hover:bg-accent hover:text-accent-foreground transition-smooth h-10 px-4 py-2 flex-1">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18"
                                             viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                                             stroke-linecap="round" stroke-linejoin="round"
                                             className="lucide lucide-download">
                                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                                            <polyline points="7 10 12 15 17 10"></polyline>
                                            <line x1="12" x2="12" y1="15" y2="3"></line>
                                        </svg>
                                        Datasheet
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div
                            className="group bg-card rounded-2xl shadow-card hover:shadow-elevated transition-all duration-300 overflow-hidden animate-fade-in-up"
                            style="animation-delay: 0.1s;">
                            <div className="relative h-64 overflow-hidden bg-gradient-subtle"><img
                                src="/assets/smart-linens-ExIY8nFP.jpg" alt="URTag Smart Linens"
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"/>
                                <div className="absolute inset-0 bg-gradient-to-t from-primary/60 to-transparent"></div>
                            </div>
                            <div className="p-8">
                                <div
                                    className="inline-block px-3 py-1 bg-accent/10 text-accent text-sm font-medium rounded-full mb-4">Smart
                                    Linens
                                </div>
                                <h3 className="text-3xl font-bold text-foreground mb-4 group-hover:text-accent transition-colors">URTag
                                    Smart Linens</h3><p
                                className="text-muted-foreground mb-6 leading-relaxed">Pre-tagged sheets, towels, and
                                uniforms designed for plug-and-play RFID deployment in hospitality, healthcare, and
                                laundry operations.</p>
                                <div className="space-y-2 mb-6">
                                    <div className="flex items-center gap-2">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18"
                                             viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                                             stroke-linecap="round" stroke-linejoin="round"
                                             className="lucide lucide-check text-accent flex-shrink-0">
                                            <path d="M20 6 9 17l-5-5"></path>
                                        </svg>
                                        <span className="text-sm text-foreground">Washable &amp; durable</span></div>
                                    <div className="flex items-center gap-2">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18"
                                             viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                                             stroke-linecap="round" stroke-linejoin="round"
                                             className="lucide lucide-check text-accent flex-shrink-0">
                                            <path d="M20 6 9 17l-5-5"></path>
                                        </svg>
                                        <span className="text-sm text-foreground">Available in multiple linen types (sheets, towels, uniforms)</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18"
                                             viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                                             stroke-linecap="round" stroke-linejoin="round"
                                             className="lucide lucide-check text-accent flex-shrink-0">
                                            <path d="M20 6 9 17l-5-5"></path>
                                        </svg>
                                        <span className="text-sm text-foreground">Factory-integrated RFID chips</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18"
                                             viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                                             stroke-linecap="round" stroke-linejoin="round"
                                             className="lucide lucide-check text-accent flex-shrink-0">
                                            <path d="M20 6 9 17l-5-5"></path>
                                        </svg>
                                        <span className="text-sm text-foreground">Ready for immediate use, no sewing required</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18"
                                             viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                                             stroke-linecap="round" stroke-linejoin="round"
                                             className="lucide lucide-check text-accent flex-shrink-0">
                                            <path d="M20 6 9 17l-5-5"></path>
                                        </svg>
                                        <span className="text-sm text-foreground">Custom branding &amp; packaging options</span>
                                    </div>
                                </div>
                                <div className="border-t border-border pt-6 mb-6"><h4
                                    className="font-semibold text-foreground mb-3">Technical Specs</h4>
                                    <ul className="space-y-1">
                                        <li className="text-sm text-muted-foreground">Read range: 3–6m (depending on
                                            environment)
                                        </li>
                                        <li className="text-sm text-muted-foreground">Wash cycles: 200+ industrial
                                            washes
                                        </li>
                                        <li className="text-sm text-muted-foreground">Tag type: HF / UHF (selectable)
                                        </li>
                                        <li className="text-sm text-muted-foreground">Sizes &amp; fabric types: Fully
                                            customizable
                                        </li>
                                    </ul>
                                </div>
                                <div className="flex gap-3"><a
                                    className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&amp;_svg]:pointer-events-none [&amp;_svg]:size-4 [&amp;_svg]:shrink-0 bg-accent text-accent-foreground hover:bg-turquoise-light shadow-glow hover:shadow-elevated transition-smooth font-semibold h-10 px-4 py-2 flex-1"
                                    href="/contact">Get Quote</a>
                                    <button
                                        className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&amp;_svg]:pointer-events-none [&amp;_svg]:size-4 [&amp;_svg]:shrink-0 border-2 border-input bg-background hover:bg-accent hover:text-accent-foreground transition-smooth h-10 px-4 py-2 flex-1">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18"
                                             viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                                             stroke-linecap="round" stroke-linejoin="round"
                                             className="lucide lucide-download">
                                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                                            <polyline points="7 10 12 15 17 10"></polyline>
                                            <line x1="12" x2="12" y1="15" y2="3"></line>
                                        </svg>
                                        Datasheet
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div
                            className="group bg-card rounded-2xl shadow-card hover:shadow-elevated transition-all duration-300 overflow-hidden animate-fade-in-up"
                            style="animation-delay: 0.2s;">
                            <div className="relative h-64 overflow-hidden bg-gradient-subtle"><img
                                src="/assets/urtag-silicone-CVjhgDF4.jpg" alt="URTag Silicone"
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"/>
                                <div className="absolute inset-0 bg-gradient-to-t from-primary/60 to-transparent"></div>
                            </div>
                            <div className="p-8">
                                <div
                                    className="inline-block px-3 py-1 bg-accent/10 text-accent text-sm font-medium rounded-full mb-4">Heat-Resistant
                                    RFID Tag
                                </div>
                                <h3 className="text-3xl font-bold text-foreground mb-4 group-hover:text-accent transition-colors">URTag
                                    Silicone</h3><p className="text-muted-foreground mb-6 leading-relaxed">Withstands
                                industrial washing and high-temperature drying. Ideal for commercial laundry
                                operations.</p>
                                <div className="space-y-2 mb-6">
                                    <div className="flex items-center gap-2">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18"
                                             viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                                             stroke-linecap="round" stroke-linejoin="round"
                                             className="lucide lucide-check text-accent flex-shrink-0">
                                            <path d="M20 6 9 17l-5-5"></path>
                                        </svg>
                                        <span className="text-sm text-foreground">Heat resistant 200°C</span></div>
                                    <div className="flex items-center gap-2">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18"
                                             viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                                             stroke-linecap="round" stroke-linejoin="round"
                                             className="lucide lucide-check text-accent flex-shrink-0">
                                            <path d="M20 6 9 17l-5-5"></path>
                                        </svg>
                                        <span className="text-sm text-foreground">Chemical resistant</span></div>
                                    <div className="flex items-center gap-2">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18"
                                             viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                                             stroke-linecap="round" stroke-linejoin="round"
                                             className="lucide lucide-check text-accent flex-shrink-0">
                                            <path d="M20 6 9 17l-5-5"></path>
                                        </svg>
                                        <span className="text-sm text-foreground">300+ wash cycles</span></div>
                                    <div className="flex items-center gap-2">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18"
                                             viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                                             stroke-linecap="round" stroke-linejoin="round"
                                             className="lucide lucide-check text-accent flex-shrink-0">
                                            <path d="M20 6 9 17l-5-5"></path>
                                        </svg>
                                        <span className="text-sm text-foreground">Tamper-evident</span></div>
                                </div>
                                <div className="border-t border-border pt-6 mb-6"><h4
                                    className="font-semibold text-foreground mb-3">Technical Specs</h4>
                                    <ul className="space-y-1">
                                        <li className="text-sm text-muted-foreground">Temperature: -40°C to 200°C</li>
                                        <li className="text-sm text-muted-foreground">IP68 rated</li>
                                        <li className="text-sm text-muted-foreground">Read range: 4-6m</li>
                                    </ul>
                                </div>
                                <div className="flex gap-3"><a
                                    className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&amp;_svg]:pointer-events-none [&amp;_svg]:size-4 [&amp;_svg]:shrink-0 bg-accent text-accent-foreground hover:bg-turquoise-light shadow-glow hover:shadow-elevated transition-smooth font-semibold h-10 px-4 py-2 flex-1"
                                    href="/contact">Get Quote</a>
                                    <button
                                        className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&amp;_svg]:pointer-events-none [&amp;_svg]:size-4 [&amp;_svg]:shrink-0 border-2 border-input bg-background hover:bg-accent hover:text-accent-foreground transition-smooth h-10 px-4 py-2 flex-1">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18"
                                             viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                                             stroke-linecap="round" stroke-linejoin="round"
                                             className="lucide lucide-download">
                                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                                            <polyline points="7 10 12 15 17 10"></polyline>
                                            <line x1="12" x2="12" y1="15" y2="3"></line>
                                        </svg>
                                        Datasheet
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div
                            className="group bg-card rounded-2xl shadow-card hover:shadow-elevated transition-all duration-300 overflow-hidden animate-fade-in-up"
                            style="animation-delay: 0.3s;">
                            <div className="relative h-64 overflow-hidden bg-gradient-subtle"><img
                                src="/assets/rfid-readers-Ccpsdnre.jpg" alt="RFID Readers"
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"/>
                                <div className="absolute inset-0 bg-gradient-to-t from-primary/60 to-transparent"></div>
                            </div>
                            <div className="p-8">
                                <div
                                    className="inline-block px-3 py-1 bg-accent/10 text-accent text-sm font-medium rounded-full mb-4">Fixed &amp; Handheld
                                    Solutions
                                </div>
                                <h3 className="text-3xl font-bold text-foreground mb-4 group-hover:text-accent transition-colors">RFID
                                    Readers</h3><p className="text-muted-foreground mb-6 leading-relaxed">Complete
                                reader ecosystem from portal readers to mobile handhelds for every use case.</p>
                                <div className="space-y-2 mb-6">
                                    <div className="flex items-center gap-2">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18"
                                             viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                                             stroke-linecap="round" stroke-linejoin="round"
                                             className="lucide lucide-check text-accent flex-shrink-0">
                                            <path d="M20 6 9 17l-5-5"></path>
                                        </svg>
                                        <span className="text-sm text-foreground">Multi-protocol support</span></div>
                                    <div className="flex items-center gap-2">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18"
                                             viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                                             stroke-linecap="round" stroke-linejoin="round"
                                             className="lucide lucide-check text-accent flex-shrink-0">
                                            <path d="M20 6 9 17l-5-5"></path>
                                        </svg>
                                        <span className="text-sm text-foreground">Cloud connectivity</span></div>
                                    <div className="flex items-center gap-2">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18"
                                             viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                                             stroke-linecap="round" stroke-linejoin="round"
                                             className="lucide lucide-check text-accent flex-shrink-0">
                                            <path d="M20 6 9 17l-5-5"></path>
                                        </svg>
                                        <span className="text-sm text-foreground">Real-time tracking</span></div>
                                    <div className="flex items-center gap-2">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18"
                                             viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                                             stroke-linecap="round" stroke-linejoin="round"
                                             className="lucide lucide-check text-accent flex-shrink-0">
                                            <path d="M20 6 9 17l-5-5"></path>
                                        </svg>
                                        <span className="text-sm text-foreground">Easy deployment</span></div>
                                </div>
                                <div className="border-t border-border pt-6 mb-6"><h4
                                    className="font-semibold text-foreground mb-3">Technical Specs</h4>
                                    <ul className="space-y-1">
                                        <li className="text-sm text-muted-foreground">Read rate: 700+ tags/sec</li>
                                        <li className="text-sm text-muted-foreground">Connectivity: WiFi, 4G</li>
                                        <li className="text-sm text-muted-foreground">Power: PoE/Battery</li>
                                    </ul>
                                </div>
                                <div className="flex gap-3"><a
                                    className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&amp;_svg]:pointer-events-none [&amp;_svg]:size-4 [&amp;_svg]:shrink-0 bg-accent text-accent-foreground hover:bg-turquoise-light shadow-glow hover:shadow-elevated transition-smooth font-semibold h-10 px-4 py-2 flex-1"
                                    href="/contact">Get Quote</a>
                                    <button
                                        className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&amp;_svg]:pointer-events-none [&amp;_svg]:size-4 [&amp;_svg]:shrink-0 border-2 border-input bg-background hover:bg-accent hover:text-accent-foreground transition-smooth h-10 px-4 py-2 flex-1">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18"
                                             viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                                             stroke-linecap="round" stroke-linejoin="round"
                                             className="lucide lucide-download">
                                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                                            <polyline points="7 10 12 15 17 10"></polyline>
                                            <line x1="12" x2="12" y1="15" y2="3"></line>
                                        </svg>
                                        Datasheet
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}