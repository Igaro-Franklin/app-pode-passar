import { 
    View, 
    StyleSheet, 
    Pressable, 
    Text, 
    SafeAreaView, 
    Platform, 
    StatusBar 
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { colors } from "../../constants/colors";
import { router } from "expo-router";

interface HeaderProps{
    title: string;
}

export function Header({ title }: HeaderProps){
    return(
        <SafeAreaView style={styles.container}>

            <View style={styles.content}>
                <View style={styles.row}>
                    <Pressable onPress={() => router.back()}>
                        <Feather name="arrow-left" size={40} color="#fff" />
                    </Pressable>

                    <Text style={styles.title}>{title}</Text>
                </View>
            </View>

        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container:{
        backgroundColor: colors.azul,
        borderBottomRightRadius: 100,
        borderBottomLeftRadius: 0,
        marginBottom: 14,
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight! + 34 : 34,
    },

    content:{
        paddingLeft: 16,
        paddingRight: 16,
        paddingBottom: 34,
        borderBottomRightRadius: 14,
        borderBottomLeftRadius: 14,
    },

    row:{
        flexDirection: 'row',
        gap: 16,
        alignItems: 'center',
        width: 240
    },

    title:{
        fontSize: 30,
        fontWeight: 'bold',
        color: colors.branco,
    }
})