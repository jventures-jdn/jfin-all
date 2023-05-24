// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { GlobalConfig } from '@utils/global-config'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    res.status(200).json(GlobalConfig.get())
}
