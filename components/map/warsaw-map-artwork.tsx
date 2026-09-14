export function WarsawMapArtwork() {
  return (
    <div className="map-artwork" aria-hidden="true">
      <svg className="map-artwork__svg" viewBox="0 0 900 1100" preserveAspectRatio="xMidYMid slice">
        <path className="map-river" d="M650 -60C575 108 687 197 611 340c-77 145 58 257-15 399-72 140 38 246-19 421" />
        <g className="map-blocks">
          <path d="M67 73h218l50 116-72 113H48Z" />
          <path d="m365 62 205 19 29 130-183 76-72-99Z" />
          <path d="m70 347 198-25 78 113-66 139-227-29Z" />
          <path d="m377 322 184-80 61 109-36 180-204 24-52-112Z" />
          <path d="m41 608 239-1 89 124-106 121-216-41Z" />
          <path d="m384 591 191-29 36 164-108 130-152-106Z" />
          <path d="m74 878 212-3 81 126-91 129H46Z" />
          <path d="m394 884 132-28 63 152-77 126-155-78Z" />
          <path d="m688 54 171 20-3 218-153 39-61-139Z" />
          <path d="m683 367 183-36 28 231-194 33-63-121Z" />
          <path d="m680 630 198-38 4 224-174 52-79-117Z" />
          <path d="m663 900 212-53 22 265-231 8-49-111Z" />
        </g>
        <g className="map-streets map-streets--major">
          <path d="M-20 255 910 835" />
          <path d="M121 -30 527 1140" />
          <path d="M-30 792 920 456" />
          <path d="M292 -20 835 1124" />
        </g>
        <g className="map-streets">
          <path d="m-20 116 608 438" />
          <path d="m-35 466 596-260" />
          <path d="m20 997 545-542" />
          <path d="m155-10 10 1130" />
          <path d="m325-10 28 1130" />
          <path d="m482-10 14 1130" />
          <path d="m700-10 10 1130" />
          <path d="M-10 170h912" />
          <path d="M-10 395h912" />
          <path d="M-10 620h912" />
          <path d="M-10 880h912" />
          <path d="m570 1140 330-726" />
          <path d="m620 50 280 258" />
        </g>
        <g className="map-rail">
          <path d="M-10 707 608 474" />
          <path d="M-10 723 614 490" />
        </g>
        <circle className="map-landmark" cx="431" cy="465" r="14" />
        <circle className="map-landmark" cx="231" cy="705" r="9" />
        <circle className="map-landmark" cx="754" cy="517" r="9" />
      </svg>
    </div>
  );
}
