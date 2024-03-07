import * as React from "react";
import { memo } from "react";
import Svg, { Circle, ClipPath, Defs, Ellipse, G, Path, SvgProps } from "react-native-svg";

interface Props extends SvgProps {
  fill?: string;
  width?: number;
  height?: number;
  xmlns?: string;
}

const homeSolidIcon = (props: Props) => (
  <Svg
    {...props}
    width={props.width || 24}
    height={props.height || 24}
    viewBox={`0 0 24 24`}
    preserveAspectRatio="xMidYMid meet"
    fill={props.fill || "none"}
  >
    <Path
      fill="#F89300"
      d="M13.608 5.05a2.62 2.62 0 0 0-3.216 0l-4.88 3.796A2.62 2.62 0 0 0 4.5 10.915v5.965a2.62 2.62 0 0 0 2.62 2.62h2.13c.69 0 1.25-.56 1.25-1.25v-2.601c0-.194.034-.3.069-.356A1.682 1.682 0 0 1 12 14.5a1.69 1.69 0 0 1 1.431.793c.035.056.069.162.069.356v2.601c0 .69.56 1.25 1.25 1.25h2.13a2.62 2.62 0 0 0 2.62-2.62v-5.965a2.62 2.62 0 0 0-1.012-2.069l-4.88-3.795Z"
    />
  </Svg>
);
export const HomeSolidIconMemo = memo(homeSolidIcon);

const HomeLineIcon = (props: Props) => (
  <Svg
    {...props}
    width={props.width || 24}
    height={props.height || 24}
    viewBox={`0 0 24 24`}
    preserveAspectRatio="xMidYMid meet"
    fill={props.fill || "none"}
  >
    <Path
      stroke="#9E9E9E"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M5.25 16.88v-5.965c0-.577.266-1.122.722-1.476l4.88-3.796a1.87 1.87 0 0 1 2.296 0l4.88 3.795c.456.355.722.9.722 1.477v5.965a1.87 1.87 0 0 1-1.87 1.87h-2.13a.5.5 0 0 1-.5-.5v-2.601c0-.263-.043-.53-.182-.753A2.433 2.433 0 0 0 12 13.75a2.44 2.44 0 0 0-2.068 1.146c-.139.223-.182.49-.182.753v2.601a.5.5 0 0 1-.5.5H7.12a1.87 1.87 0 0 1-1.87-1.87Z"
    />
  </Svg>
);
export const HomeLineIconMemo = memo(HomeLineIcon);


const SearchLineIcon = (props: Props) => (
  <Svg
    {...props}
    width={props.width || 24}
    height={props.height || 24}
    viewBox={`0 0 24 24`}
    preserveAspectRatio="xMidYMid meet"
    fill={props.fill || "none"}
  >
    <G stroke="#9E9E9E" strokeWidth={1.5} clipPath="url(#a)">
      <Ellipse cx={12} cy={12} rx={2.75} ry={7.25} />
      <Path strokeLinecap="round" strokeLinejoin="round" d="M4.75 12h14.5" />
      <Circle cx={12} cy={12} r={7.25} />
    </G>
    <Defs>
      <ClipPath id="a">
        <Path fill="#fff" d="M0 0h24v24H0z" />
      </ClipPath>
    </Defs>
  </Svg>
);
export const SearchLineIconMemo = memo(SearchLineIcon);

const SearchSolidIcon = (props: Props) => (
  <Svg
    {...props}
    width={props.width || 24}
    height={props.height || 24}
    viewBox={`0 0 24 24`}
    preserveAspectRatio="xMidYMid meet"
    fill={props.fill || "none"}
  >
    <Path
      fill="#F89300"
      d="M9.761 11.25h4.478c-.062-2.05-.372-3.867-.827-5.194-.256-.747-.544-1.297-.827-1.646-.288-.355-.49-.41-.585-.41-.095 0-.297.055-.585.41-.283.349-.57.9-.827 1.646-.455 1.327-.765 3.143-.827 5.194ZM14.239 12.75c-.062 2.05-.372 3.867-.827 5.194-.256.747-.544 1.297-.827 1.646-.288.355-.49.41-.585.41-.095 0-.297-.055-.585-.41-.283-.349-.57-.9-.827-1.646-.455-1.327-.765-3.143-.827-5.194h4.478ZM15.74 12.75h4.225a8.007 8.007 0 0 1-5.653 6.91c.194-.37.366-.785.519-1.23.517-1.51.847-3.497.908-5.68ZM19.965 11.25H15.74c-.061-2.183-.39-4.17-.908-5.68a8.98 8.98 0 0 0-.519-1.23 8.007 8.007 0 0 1 5.653 6.91ZM8.26 11.25H4.036a8.007 8.007 0 0 1 5.653-6.91 8.976 8.976 0 0 0-.519 1.23c-.517 1.51-.847 3.497-.908 5.68ZM8.26 12.75H4.036a8.007 8.007 0 0 0 5.653 6.91 8.972 8.972 0 0 1-.519-1.23c-.517-1.51-.847-3.497-.908-5.68Z"
    />
  </Svg>
);
export const SearchSolidIconMemo = memo(SearchSolidIcon);

const CartSolidIcon = (props: Props) => (
  <Svg
    {...props}
    width={props.width || 24}
    height={props.height || 24}
    viewBox={`0 0 24 24`}
    preserveAspectRatio="xMidYMid meet"
    fill={props.fill || "none"}
  >
    <Path
      fill="#F89300"
      d="M4.5 6.75A.75.75 0 0 1 5.25 6H6.4c.525 0 .994.327 1.174.82L8.007 8h10.03a1.25 1.25 0 0 1 1.174 1.677l-1.277 3.513A2.75 2.75 0 0 1 15.349 15h-4.452a2.75 2.75 0 0 1-2.582-1.803L6.226 7.5H5.25a.75.75 0 0 1-.75-.75ZM9 17a1 1 0 1 1 2 0 1 1 0 0 1-2 0ZM15 17a1 1 0 1 1 2 0 1 1 0 0 1-2 0Z"
    />
  </Svg>
);
export const CartSolidIconMemo = memo(CartSolidIcon);

const CartLineIcon = (props: Props) => (
  <Svg
    {...props}
    width={props.width || 24}
    height={props.height || 24}
    viewBox={`0 0 24 24`}
    preserveAspectRatio="xMidYMid meet"
    fill={props.fill || "none"}
  >
    <Path
      fill="#9E9E9E"
      d="M9 17a1 1 0 1 1 2 0 1 1 0 0 1-2 0ZM15 17a1 1 0 1 1 2 0 1 1 0 0 1-2 0Z"
    />
    <Path
      stroke="#9E9E9E"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M5.25 6.75H6.4a.5.5 0 0 1 .47.328l2.15 5.86a2 2 0 0 0 1.877 1.312h4.412a2 2 0 0 0 1.897-1.367l1.325-3.975a.5.5 0 0 0-.475-.658H10.5"
    />
  </Svg>
);
export const CartLineIconMemo = memo(CartLineIcon);

const WishListSolidIcon = (props: Props) => (
  <Svg
    {...props}
    width={props.width || 24}
    height={props.height || 24}
    viewBox={`0 0 24 24`}
    preserveAspectRatio="xMidYMid meet"
    fill={props.fill || "none"}
  >
    <Path
      fill="#F89300"
      d="M10.988 4.547a1.75 1.75 0 0 1 2.024 0l4.27 3.025a1.75 1.75 0 0 1 0 2.856l-4.27 3.025a1.75 1.75 0 0 1-2.024 0l-4.27-3.025a1.75 1.75 0 0 1 0-2.856l4.27-3.025Z"
    />
    <Path
      fill="#F89300"
      d="M6.126 12.334a.75.75 0 0 1 1.04-.208l4.695 3.13a.25.25 0 0 0 .278 0l4.695-3.13a.75.75 0 1 1 .832 1.248l-4.695 3.13a1.75 1.75 0 0 1-1.942 0l-4.695-3.13a.75.75 0 0 1-.208-1.04Z"
    />
    <Path
      fill="#F89300"
      d="M6.126 15.334a.75.75 0 0 1 1.04-.208l4.695 3.13a.25.25 0 0 0 .278 0l4.695-3.13a.75.75 0 1 1 .832 1.248l-4.695 3.13a1.75 1.75 0 0 1-1.942 0l-4.695-3.13a.75.75 0 0 1-.208-1.04Z"
    />
  </Svg>
);
export const WishListSolidIconMemo = memo(WishListSolidIcon);
const WishListLineIcon = (props: Props) => (
  <Svg
    {...props}
    width={props.width || 16}
    height={props.height || 16}
    viewBox={`0 0 14 16`}
    preserveAspectRatio="xMidYMid meet"
    fill={props.fill || "none"}
  >
    <Path
      fill="#9E9E9E"
      d="M5.988.547a1.75 1.75 0 0 1 2.023 0l4.27 3.025a1.75 1.75 0 0 1 0 2.856l-4.27 3.025a1.75 1.75 0 0 1-2.023 0l-4.27-3.025a1.75 1.75 0 0 1 0-2.856L5.988.547Z"
    />
    <Path
      fill="#9E9E9E"
      d="M1.126 8.334a.75.75 0 0 1 1.04-.208l4.695 3.13a.25.25 0 0 0 .278 0l4.695-3.13a.75.75 0 0 1 .832 1.248l-4.695 3.13a1.75 1.75 0 0 1-1.942 0l-4.695-3.13a.75.75 0 0 1-.208-1.04Z"
    />
    <Path
      fill="#9E9E9E"
      d="M1.126 11.334a.75.75 0 0 1 1.04-.208l4.695 3.13a.25.25 0 0 0 .278 0l4.695-3.13a.75.75 0 1 1 .832 1.248l-4.695 3.13a1.75 1.75 0 0 1-1.942 0l-4.695-3.13a.75.75 0 0 1-.208-1.04Z"
    />
  </Svg>
);
export const WishListLineIconMemo = memo(WishListLineIcon);

const AccountSolidIcon = (props: Props) => (
  <Svg
    {...props}
    width={props.width || 24}
    height={props.height || 24}
    viewBox={`0 0 24 24`}
    preserveAspectRatio="xMidYMid meet"
    fill={props.fill}
  >
    <Path
      fill="#F89300"
      d="M12.1 6.002a3 3 0 1 0-.2 5.996 3 3 0 0 0 .2-5.996ZM12 13.5a5.629 5.629 0 0 0-3.122.945 5.612 5.612 0 0 0-2.07 2.517A.75.75 0 0 0 7.5 18h9a.75.75 0 0 0 .693-1.038 5.612 5.612 0 0 0-2.07-2.517A5.629 5.629 0 0 0 12 13.5Z"
    />
  </Svg>
);
export const AccountSolidIconMemo = memo(AccountSolidIcon);

const AccountLineIcon = (props: Props) => (
  <Svg
    {...props}
    width={props.width || 24}
    height={props.height || 24}
    viewBox={`0 0 24 24`}
    preserveAspectRatio="xMidYMid meet"
    fill={props.fill || "none"}
  >
    <Path
      stroke="#9E9E9E"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M9.751 8.926a2.25 2.25 0 1 0 4.498.148 2.25 2.25 0 0 0-4.498-.148ZM16.5 17.25a4.863 4.863 0 0 0-1.794-2.181A4.879 4.879 0 0 0 7.5 17.25"
    />
  </Svg>
);
export const AccountLineIconMemo = memo(AccountLineIcon);
