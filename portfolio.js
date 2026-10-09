(() => {
  /* ========================================
     YOUR PHOTO LIST
     Add new photographs here.
     Sizes: normal, wide, tall, large
     Position controls the thumbnail crop.
     ======================================== */

  const portfolioPhotos = [
    {
      file: "images/Photo-1.jpg",
      size: "large",
      position: "center",
      alt: "Selected photograph 1 from the mkconfilm portfolio",
      caption: ""
    },
    {
      file: "images/Photo-2.jpg",
      size: "tall",
      position: "center",
      alt: "Selected photograph 2 from the mkconfilm portfolio",
      caption: ""
    },
    {
      file: "images/Photo-3.jpg",
      size: "normal",
      position: "center",
      alt: "Selected photograph 3 from the mkconfilm portfolio",
      caption: ""
    },
    {
      file: "images/Photo-4.jpg",
      size: "normal",
      position: "center",
      alt: "Selected photograph 4 from the mkconfilm portfolio",
      caption: ""
    },
    {
      file: "images/Photo-5.jpg",
      size: "wide",
      position: "center",
      alt: "Selected photograph 5 from the mkconfilm portfolio",
      caption: ""
    }
  ];

  /* ========================================
     GALLERY AND PHOTO VIEWER
     No edits needed below this line.
     ======================================== */

  const grid = document.querySelector("#photo-grid");
  const viewer = document.querySelector("#photo-viewer");
  const viewerImage = document.querySelector("#photo-viewer-image");
  const viewerCaption = document.querySelector("#photo-viewer-caption");
  const closeButton = document.querySelector("#photo-viewer-close");

  if (
    !grid ||
    !viewer ||
    !viewerImage ||
    !viewerCaption ||
    !closeButton
  ) {
    return;
  }

  const allowedSizes = new Set([
    "normal",
    "wide",
    "tall",
    "large"
  ]);

  let lastOpenedTile = null;
  let previousBodyOverflow = "";

  function openPhoto(photo, tile) {
    lastOpenedTile = tile;

    viewerImage.src = photo.file;
    viewerImage.alt = photo.alt;
    viewerCaption.textContent = photo.caption || "";

    previousBodyOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    viewer.showModal();
  }

  function closePhoto() {
    if (viewer.open) {
      viewer.close();
    }
  }

  portfolioPhotos.forEach((photo, index) => {
    const size = allowedSizes.has(photo.size)
      ? photo.size
      : "normal";

    const tile = document.createElement("button");

    tile.type = "button";
    tile.className = `photo-tile photo-tile--${size}`;
    tile.setAttribute(
      "aria-label",
      `View full photograph: ${photo.alt}`
    );
    tile.setAttribute("aria-haspopup", "dialog");
    tile.style.setProperty(
      "--photo-position",
      photo.position || "center"
    );

    const image = document.createElement("img");

    image.src = photo.file;
    image.alt = photo.alt;
    image.loading = index < 4 ? "eager" : "lazy";
    image.decoding = "async";

    tile.append(image);

    tile.addEventListener("click", () => {
      openPhoto(photo, tile);
    });

    grid.append(tile);
  });

  closeButton.addEventListener("click", closePhoto);

  // Close when clicking outside the dialog's visible rectangle.
  viewer.addEventListener("click", (event) => {
    if (event.target !== viewer) return;

    const rectangle = viewer.getBoundingClientRect();

    const outside =
      event.clientX < rectangle.left ||
      event.clientX > rectangle.right ||
      event.clientY < rectangle.top ||
      event.clientY > rectangle.bottom;

    if (outside) {
      closePhoto();
    }
  });

  // Runs after the close button, backdrop click, or Escape key.
  viewer.addEventListener("close", () => {
    document.body.style.overflow = previousBodyOverflow;

    viewerImage.removeAttribute("src");
    viewerImage.alt = "";
    viewerCaption.textContent = "";

    if (lastOpenedTile) {
      lastOpenedTile.focus({ preventScroll: true });
    }
  });
})();
