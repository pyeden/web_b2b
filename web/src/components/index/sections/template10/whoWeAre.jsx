
import Image from "next/image";
import lang from "@/locales";

export default function WhoWeAre({ aboutData }) {

    return (
        <div className="bg-mainColorLight py-8 lg:py-20 min-h-[900px]">
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 px-6 lg:px-8 h-full">
                <div className="flex flex-col p-0">
                    <div className="h-1 w-28 bg-gradient-to-r from-mainColorNormal to-mainColorNormalAlpha-50 mb-6"></div>
                    <h2 className="text-2xl lg:text-4xl font-bold text-gray-900 mb-6">{lang.WhoWeAre}</h2>
                    <p
                        className="flex-1 text-gray-700 mb-4 overflow-hidden relative"
                        dangerouslySetInnerHTML={{ __html: aboutData.aboutText }}
                    >
                    </p>
                </div>
                <div className="flex flex-col">
                    <div className="relative h-60 md:h-full min-h-[400px] bg-gray-100 rounded-lg overflow-hidden group">
                        <Image
                            src={`${process.env.NEXT_PUBLIC_BASE_URL}/upload/img/${aboutData.aboutCover}`}
                            alt="About Us"
                            fill
                            quality={100}
                            sizes="(max-width: 1024px) 100vw, 50vw"
                            className="object-cover object-center transition-[object-fit] duration-500 ease-in-out group-hover:object-contain"
                            priority
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
