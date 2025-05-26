import dynamic from 'next/dynamic';
import "react-lite-youtube-embed/dist/LiteYouTubeEmbed.css";

const LiteYouTubeEmbed = dynamic(() => import('react-lite-youtube-embed'), {
  ssr: false,
  loading: () => <p>Loading video...</p> // Optional loading state
});

const Youtube = ({ id, title, ...rest }) => {
  // Ensure id and title are provided before rendering
  if (!id || !title) {
    console.error("YouTube embed missing id or title props.");
    return <p>Error: YouTube video id or title missing.</p>;
  }

  return (
    <div className="overflow-hidden rounded">
      <LiteYouTubeEmbed id={id} title={title} {...rest} />
    </div>
  );
};

export default Youtube;
