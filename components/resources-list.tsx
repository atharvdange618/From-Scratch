"use client";

import { BookOpen, ExternalLink } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import TrackableLink from "@/components/analytics/trackable-link";

interface Resource {
  title: string;
  url: string;
}

interface ResourcesListProps {
  resources: Resource[];
  postTitle: string;
  category: string;
}

export function ResourcesList({
  resources,
  postTitle,
  category,
}: ResourcesListProps) {
  if (!resources || resources.length === 0) {
    return null;
  }

  return (
    <Card className="mt-8 rounded-none border-4 border-black dark:border-gray-700 bg-[#E0FFF1] dark:bg-gray-800 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:shadow-[6px_6px_0px_0px_rgba(74,144,204,0.3)]">
      <CardContent className="p-6">
        <h3 className="mb-4 flex items-center gap-2 font-sans text-xl font-bold dark:text-white">
          <BookOpen className="h-5 w-5" />
          Resources
        </h3>
        <ul className="space-y-3">
          {resources.map((resource, index) => (
            <li key={resource.url}>
              <TrackableLink
                href={resource.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-start gap-2 font-bold transition-all hover:translate-x-1"
                trackingData={{
                  eventType: "external_link_click",
                  eventData: {
                    linkType: "resource",
                    resourceTitle: resource.title,
                    resourceUrl: resource.url,
                    resourceIndex: index,
                    postTitle,
                    category,
                    source: "post_resources",
                  },
                }}
              >
                <ExternalLink className="mt-0.5 h-4 w-4 flex-shrink-0 transition-colors group-hover:text-blue-600" />
                <span className="transition-colors group-hover:text-blue-600">
                  {resource.title}
                </span>
              </TrackableLink>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
