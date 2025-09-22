import Link from "next/link";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Image from "next/image";
import { Card } from "../ui/card";

export interface BreadcrumbItemProps {
  label: string;
  href?: string;
}

export interface CustomBreadcumbProps {
  items: BreadcrumbItemProps[];
  title?: string;
}

export function CustomBreadcumb({ items, title }: CustomBreadcumbProps) {
  return (
    <Card className="bg-pmc-darkblue flex h-28 justify-center px-6 align-middle">
      {/* <Card className="bg-pmc-gray/50 text-primary my-6 px-6 backdrop-blur"> */}
      <Breadcrumb>
        <BreadcrumbList className="text-primary-foreground flex flex-row items-center justify-between text-sm">
          <div className="flex flex-col">
            <h1 className="text-secondary mb-2 text-2xl font-semibold">
              {title}
            </h1>
            <div className="flex">
              {items.map((item, index) => (
                <div
                  key={index}
                  className="text-primary-foreground flex items-center justify-center align-middle"
                >
                  <BreadcrumbItem className="hover:text-primary-foreground">
                    {item.href ? (
                      <BreadcrumbLink asChild>
                        <Link href={item.href}>{item.label}</Link>
                      </BreadcrumbLink>
                    ) : (
                      <BreadcrumbPage>{item.label}</BreadcrumbPage>
                    )}
                  </BreadcrumbItem>
                  {index < items.length - 1 && (
                    <BreadcrumbSeparator className="mx-1.5" />

                    // <div className="relative h-5 w-5">
                    //   <Image
                    //     src={'/img/fundo-seta-logo.svg'}
                    //     alt="Arrow"
                    //     fill
                    //     className="object-cover"
                    //   />
                    // </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="relative h-48 w-48">
            <Image
              src={"/img/logopmc.png"}
              alt="Logo - Prefeitura Municipal de Cariacica"
              fill
              quality={100}
              className="object-contain"
            />
          </div>
        </BreadcrumbList>
      </Breadcrumb>
    </Card>
  );
}
