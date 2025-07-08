import React, { memo } from 'react'
import { CircleLoader, ClimbingBoxLoader, ClipLoader, HashLoader, MoonLoader, PacmanLoader, PropagateLoader, RingLoader, RotateLoader, ScaleLoader, SyncLoader } from 'react-spinners'

const Loader = () => {
    return (
        <SyncLoader color='#ee3131' />
    )
}

export default memo(Loader)