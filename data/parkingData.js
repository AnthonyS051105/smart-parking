export const parkingSpots = [
  {
    id: 1,
    name: "CCM Basement",
    address: "Jl. Raya Warung Malang",
    image: require("../assets/images/ccm-basement.jpeg"), // Add actual images
    rating: 4.5,
    price: "Rp 5.000/jam",
    available: 12,
    total: 20,
    latitude: -6.2,
    longitude: 106.816666,
    amenities: ["CCTV", "Security", "24/7"],
    distance: 0.5, // km
    walkingTime: "2 min",
  },
  {
    id: 2,
    name: "Plaza Senayan",
    address: "Jl. Asia Afrika",
    image: require("../assets/images/plaza-senayan.jpg"),
    rating: 4.8,
    price: "Rp 8.000/jam",
    available: 8,
    total: 15,
    latitude: -6.22,
    longitude: 106.798666,
    amenities: ["Valet", "Covered", "Mall Access"],
    distance: 1.2,
    walkingTime: "5 min",
  },
  {
    id: 3,
    name: "Mall Taman Anggrek",
    address: "Jl. Letjen S. Parman",
    image: require("../assets/images/taman-anggrek.jpg"),
    rating: 4.3,
    price: "Rp 6.000/jam",
    available: 15,
    total: 25,
    latitude: -6.178,
    longitude: 106.790666,
    amenities: ["CCTV", "Lift Access"],
    distance: 2.1,
    walkingTime: "8 min",
  },
  {
    id: 4,
    name: "Grand Indonesia",
    address: "Jl. MH Thamrin",
    image: require("../assets/images/grand-indonesia.jpg"),
    rating: 4.6,
    price: "Rp 7.000/jam",
    available: 20,
    total: 30,
    latitude: -6.195,
    longitude: 106.823,
    amenities: ["Premium", "Valet", "Security"],
    distance: 1.8,
    walkingTime: "6 min",
  },
];

export const filterSpotsBySearch = (spots, searchTerm) => {
  if (!searchTerm) return spots;
  return spots.filter(
    (spot) =>
      spot.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      spot.address.toLowerCase().includes(searchTerm.toLowerCase())
  );
};

export const sortSpotsByDistance = (spots) => {
  return spots.sort((a, b) => a.distance - b.distance);
};
