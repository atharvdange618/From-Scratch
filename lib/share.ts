import { trackEvent } from "./analytics";

export const handleXShare = ({
  title,
  url,
  description,
}: {
  title: string;
  url: string;
  description?: string;
}) => {
  const shareText = description ? `${title} - ${description}` : title;
  const xUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
    shareText,
  )}&url=${encodeURIComponent(url)}`;
  window.open(xUrl, "_blank", "noopener,noreferrer");

  trackEvent("share_post", {
    method: "x",
    postTitle: title,
  });
};

export const handleLinkedInShare = ({
  title,
  url,
}: {
  title: string;
  url: string;
}) => {
  const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
    url,
  )}`;
  window.open(linkedInUrl, "_blank", "noopener,noreferrer");

  trackEvent("share_post", {
    method: "linkedin",
    postTitle: title,
  });
};

export const handleFacebookShare = ({
  title,
  url,
}: {
  title: string;
  url: string;
}) => {
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
    url,
  )}`;
  window.open(facebookUrl, "_blank", "noopener,noreferrer");

  trackEvent("share_post", {
    method: "facebook",
    postTitle: title,
  });
};
