declare const commonStyles: {
    column: {
        flexDirection: "column";
    };
    container: {
        flex: number;
        justifyContent: "center";
        alignItems: "center";
        alignSelf: "stretch";
    };
    foreground: {
        flex: number;
        paddingHorizontal: number;
        justifyContent: "flex-end";
    };
    foregroundRow: {
        flex: number;
        paddingHorizontal: number;
        alignItems: "flex-end";
        justifyContent: "space-around";
    };
    headerWrapper: {
        alignItems: "center";
        alignSelf: "stretch";
        flexDirection: "row";
        justifyContent: "space-between";
        paddingHorizontal: number;
        paddingVertical: number;
    };
    logo: {
        height: number;
        width: number;
    };
    message: {
        color: string;
        fontSize: number;
        lineHeight: number;
        letterSpacing: number;
        textAlign: "left";
    };
    messageContainer: {
        paddingVertical: number;
    };
    row: {
        flexDirection: "row";
    };
    rowReverse: {
        flexDirection: "row-reverse";
    };
    stretch: {
        alignSelf: "stretch";
    };
    wrapper: {
        alignSelf: "stretch";
        flex: number;
    };
};
export default commonStyles;
