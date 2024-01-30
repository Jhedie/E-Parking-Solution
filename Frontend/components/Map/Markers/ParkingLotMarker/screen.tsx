import { Marker } from "react-native-maps";
import { Image } from "tamagui";

const ParkingLotMarker = ({ parkingLot, onPress }) => {
  return (
    <Marker
      onPress={onPress}
      coordinate={{
        latitude: parseFloat(parkingLot.Location.Latitude),
        longitude: parseFloat(parkingLot.Location.Longitude)
      }}
      title={parkingLot.LotId}
      description="Parking Lot"
    >
      <Image
        source={require("../../../../assets/images/parking-lot-marker.png")}
        style={{ width: 35, height: 35 }}
      />
    </Marker>
  );
};

export default ParkingLotMarker;
