import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useWallet } from '@tezos-contrib/react-wallet-provider';
import { OpKind } from '@taquito/taquito';
import { getWallet } from '../libs/wallet';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import Preview from './Preview';
import Button from './Button';
import { FA2_CONTRACT_8X8_COLOR, MARKETPLACE_CONTRACT_8X8_COLOR } from '../consts';

export default function SwapButton({ token, holding }) {
  const { client } = useWallet();
  const [open, setOpen] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      editions: 1,
    },
  });

  const onSubmit = async (data) => {
    const wallet = getWallet(client);
    const [fa2Contract, marketplaceContract] = await Promise.all([
      wallet.at(FA2_CONTRACT_8X8_COLOR),
      wallet.at(MARKETPLACE_CONTRACT_8X8_COLOR),
    ]);

    const calls = [
      {
        kind: OpKind.TRANSACTION,
        ...fa2Contract.methods
          .update_operators([
            {
              add_operator: {
                operator: MARKETPLACE_CONTRACT_8X8_COLOR,
                token_id: token.token_id,
                owner: holding.holder_address,
              },
            },
          ])
          .toTransferParams({ amount: 0, mutez: true, storageLimit: 175 }),
      },
      {
        kind: OpKind.TRANSACTION,
        ...marketplaceContract.methods
          .swap(
            0,
            holding.holder_address,
            token.token_id,
            data.editions,
            FA2_CONTRACT_8X8_COLOR,
            data.editions,
            10,
            token.artist_address,
            parseFloat(data.price) * 1000000
          )
          .toTransferParams({ amount: 0, mutez: true, storageLimit: 300 }),
      },
      {
        kind: OpKind.TRANSACTION,
        ...fa2Contract.methods
          .update_operators([
            {
              remove_operator: {
                operator: MARKETPLACE_CONTRACT_8X8_COLOR,
                token_id: token.token_id,
                owner: holding.holder_address,
              },
            },
          ])
          .toTransferParams({ amount: 0, mutez: true, storageLimit: 175 }),
      },
    ];

    const batch = await wallet.batch(calls);
    await batch.send();

    setOpen(false);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Button autoWidth onClick={handleClickOpen}>
        Swap
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogContent>
            <Preview rgb={token.eightbid_rgb} />
            <div>
              <TextField
                margin="dense"
                id="editions"
                label={`Editions (max: ${holding.amount})`}
                type="number"
                fullWidth
                variant="standard"
                {...register('editions', { required: true, min: 1, max: holding.amount })}
              />
              {errors.editions?.type === 'required' && <span>This field is required</span>}
              {errors.editions?.type === 'min' && <span>At least one edition needs to be swapped</span>}
              {errors.editions?.type === 'max' && <span>You don't own that many editions (max: {holding.amount})</span>}
            </div>
            <div>
              <TextField
                autoFocus
                margin="dense"
                id="price"
                label="Price (in tez)"
                type="number"
                fullWidth
                variant="standard"
                inputProps={{
                  step: 'any',
                }}
                {...register('price', { required: true, min: 0 })}
              />
              {errors.price?.type === 'required' && <span>This field is required</span>}
              {errors.price?.type === 'min' && <span>Price can't be below 0</span>}
            </div>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} inverted>
              Cancel
            </Button>
            <Button type="submit">Swap</Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
}
