import { Dimensions, Image, Text, TouchableOpacity, View } from "react-native";

const { width } = Dimensions.get("window");
interface BookingCardProps {
  image: string;
  title: string;
  address: string;
  date: string;
  totalAmount: string;
  duration: string;
  rateType: string;
  title1: string;
  title2: string;
  onClickHandler: () => void;
  onViewTicketHandler: () => void;
}
const BookingCard = (props: BookingCardProps) => {
  return (
    <View
      style={{
        overflow: "hidden",
        marginHorizontal: 10 * 2,
        marginBottom: 10 * 2,
        borderRadius: 10,
        backgroundColor: "white"
      }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          padding: 10
        }}
      >
        <View style={{ flex: 3.3 }}>
          <Image
            source={{ uri: props.image }}
            style={{
              resizeMode: "stretch",
              width: width / 3.8,
              height: 88,
              borderRadius: 5
            }}
          />
        </View>
        <View
          style={{
            flex: 6.7,
            alignItems: "flex-start",
            marginLeft: 10 * 1.5,
            marginRight: 10 * 1.5
          }}
        >
          <Text style={{ fontSize: 16, fontWeight: "600", color: "#333" }}>
            {props.title}
          </Text>
          <Text
            numberOfLines={1}
            style={{
              fontSize: 14,
              fontWeight: "400",
              color: "#666",
              overflow: "hidden",
              marginVertical: 10 * 0.2
            }}
          >
            {props.address}
          </Text>
          <Text style={{ fontSize: 14, fontWeight: "400", color: "#666" }}>
            {props.date}
          </Text>
          <Text
            style={{
              fontSize: 16,
              fontWeight: "600",
              color: "#333",
              marginVertical: 10 * 0.2
            }}
          >
            <Text style={{ fontSize: 15, fontWeight: "400", color: "#666" }}>
              £{props.totalAmount} for {props.duration} {props.rateType}
            </Text>
          </Text>
        </View>
      </View>

      <View
        style={{
          flexDirection: "row",
          marginTop: 10 * 0.5
        }}
      >
        {props.title1 !== "" && (
          <TouchableOpacity
            onPress={props.onClickHandler}
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              padding: 10,
              backgroundColor: "white"
            }}
          >
            <Text
              numberOfLines={1}
              style={{
                fontSize: 16,
                fontWeight: "600",
                color: "#333",
                overflow: "hidden"
              }}
            >
              {props.title1}
            </Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          onPress={() => props.onViewTicketHandler()}
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            padding: 10,
            backgroundColor: "rgb(253, 176, 35)"
          }}
        >
          <Text
            numberOfLines={1}
            style={{
              fontSize: 16,
              fontWeight: "600",
              color: "black",
              overflow: "hidden"
            }}
          >
            {props.title2}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default BookingCard;
