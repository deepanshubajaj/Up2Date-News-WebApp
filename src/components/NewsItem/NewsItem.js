import React, { useState } from "react";
import PropTypes from "prop-types";
import { Button, Card } from "react-bootstrap";
import Details from "./Details/Details";
import { ReactComponent as ArrowIcon } from '../Images/ArrowIcon.svg';
import ImageModal from "../ImageModal/ImageModal";
import "./NewsItem.css";

function NewsItem(props) {
  const { imageUrl, alt, description, title, channel, published, urlNews } = props;
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleImageClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <Card className="card">
        <Card.Img
          className="card-img"
          variant="top"
          src={imageUrl}
          alt={alt}
          onClick={handleImageClick}
          style={{ cursor: 'pointer' }}
        />
        <Card.Body>
          <Card.Title>{title}</Card.Title>
          <Card.Text className="card-description">{description}</Card.Text>
          <Details channel={channel} published={published} />
          <Button
            className="card-btn"
            href={urlNews}
            target="_blank"
          >
            Read more <ArrowIcon className="arrow-icon" />
          </Button>
        </Card.Body>
      </Card>
      <ImageModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        imageUrl={imageUrl}
        alt={alt}
      />
    </>
  );
}

NewsItem.propTypes = {
  imageUrl: PropTypes.string,
  alt: PropTypes.string,
  description: PropTypes.string,
  title: PropTypes.string,
  channel: PropTypes.string,
  published: PropTypes.string,
  urlNews: PropTypes.string,
};

export default NewsItem;
