import React from "react";

export default function Tag(props) {
	return (
		<span onClick={() => props.onClick(props.value)} className="rbc-tag-item col">
			<a href="javascript:void(0)" className="close">×</a>
			<span>{props.value}</span>
		</span>
	);
}
