package models

// Categories structure
type Categories struct {
	Name    string   `json:"Name"`
	Slug    string   `json:"Slug"`
	Type    string   `json:"Type"`
	Display []string `json:"Display"`
}

// Counts structure
type Counts struct {
	Bedroom   int `json:"Bedroom"`
	Bathroom  int `json:"Bathroom"`
	Occupancy int `json:"Occupancy"`
}

// Geo info structure
type GeoInfo struct {
	Categories  []Categories `json:"Categories"`
	City        string       `json:"City"`
	Country     string       `json:"Country"`
	CountryCode string       `json:"CountryCode"`
	Display     string       `json:"Display"`
	LocationID  string       `json:"LocationID"`
	Lat         string       `json:"Lat"`
	Lng         string       `json:"Lng"`
	Slug        string       `json:"Slug"`
}

// Property structure
type Property struct {
	Amenities              map[string]string `json:"Amenities"`
	Counts                 Counts            `json:"Counts"`
	FeatureImage           string            `json:"FeatureImage"`
	IsPetFriendly          bool              `json:"IsPetFriendly"`
	MinStay                int               `json:"MinStay"`
	PropertyName           string            `json:"PropertyName"`
	PropertySlug           string            `json:"PropertySlug"`
	PropertyType           string            `json:"PropertyType"`
	PropertyTypeCategoryId string            `json:"PropertyTypeCategoryId"`
	RoomSize               float64           `json:"RoomSize"`
}

// Partner structure
type Partner struct {
	ID           string   `json:"ID"`
	OwnerID      string   `json:"OwnerID"`
	Archived     []string `json:"Archived"`
	PropertyType string   `json:"PropertyType"`
	URL          string   `json:"URL"`
}

//===== Property Send Structure =====//
type PropertySendStructure struct {
	ID        string   `json:"ID"`
	Feed      int      `json:"Feed"`
	Published bool     `json:"Published"`
	GeoInfo   GeoInfo  `json:"GeoInfo"`
	Property  Property `json:"Property"`
	Partner   Partner  `json:"Partner"`
}



//===== Property Received Structure =====//
type PropertyReceiveStructure struct {
}
