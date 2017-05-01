import React from "react";

export default function Tag(props) {
	return React.createElement(
		"span",
		{ onClick: function onClick() {
				return props.onClick(props.value);
			}, className: "rbc-tag-item col" },
		React.createElement(
			"a",
			{ href: "javascript:void(0)", className: "close" },
			"\xD7"
		),
		React.createElement(
			"span",
			null,
			props.value
		)
	);
}