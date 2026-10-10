export interface ContainerPhotoSet {
  doorView: string;
  sideView: string;
  interiorView: string;
}

export const defaultContainerPhotos: Record<string, ContainerPhotoSet> = {
  dry40: {
    doorView: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1000&q=80',
    sideView: 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=1000&q=80',
    interiorView: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=80'
  },
  dry20: {
    doorView: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=1000&q=80',
    sideView: 'https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?auto=format&fit=crop&w=1000&q=80',
    interiorView: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1000&q=80'
  },
  reefer40: {
    doorView: 'https://images.unsplash.com/photo-1506015391300-4802dc74de2e?auto=format&fit=crop&w=1000&q=80',
    sideView: 'https://images.unsplash.com/photo-1580674684081-7617fbf3d745?auto=format&fit=crop&w=1000&q=80',
    interiorView: 'https://images.unsplash.com/photo-1587293852726-70cdb56c2866?auto=format&fit=crop&w=1000&q=80'
  }
};

export const getPhotosForContainer = (type: string, id: string): [string, string, string] => {
  if (type.includes('RF')) {
    return [
      defaultContainerPhotos.reefer40.doorView,
      defaultContainerPhotos.reefer40.sideView,
      defaultContainerPhotos.reefer40.interiorView
    ];
  }
  if (type.includes('20')) {
    return [
      defaultContainerPhotos.dry20.doorView,
      defaultContainerPhotos.dry20.sideView,
      defaultContainerPhotos.dry20.interiorView
    ];
  }
  return [
    defaultContainerPhotos.dry40.doorView,
    defaultContainerPhotos.dry40.sideView,
    defaultContainerPhotos.dry40.interiorView
  ];
};
